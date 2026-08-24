import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Upload,
  Plus,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Camera,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Award,
  Trash2,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { showSuccess, showError } from "../../Utils/toast";

export default function ProfileTab({
  user,
  token,
  onProfileUpdated
}) {
  // Basic Details State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    location: "",
    contactNumber: "",
    gender: "",
    dob: "",
    skills: [],
  });

  // Dynamic Array States
  const [educationList, setEducationList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [certificationsList, setCertificationsList] = useState([]);

  // Form toggles & inputs
  const [skillInput, setSkillInput] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Modals / Add Forms State
  const [showEduForm, setShowEduForm] = useState(false);
  const [eduForm, setEduForm] = useState({
    level: "UG",
    institution: "",
    degree: "",
    fieldOfStudy: "",
    passingYear: "",
    grade: ""
  });

  const [showExpForm, setShowExpForm] = useState(false);
  const [expForm, setExpForm] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: ""
  });

  const [showProjForm, setShowProjForm] = useState(false);
  const [projForm, setProjForm] = useState({
    title: "",
    description: "",
    technologies: "",
    link: ""
  });

  const [showCertForm, setShowCertForm] = useState(false);
  const [certForm, setCertForm] = useState({
    title: "",
    issuer: "",
    issueDate: "",
    credentialUrl: ""
  });

  // Populate data when user object is available
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        contactNumber: user.contactNumber || "",
        gender: user.gender || "",
        dob: user.dob || "",
        skills: Array.isArray(user.skills) ? user.skills : [],
      });
      if (user.avatar) setAvatarPreview(user.avatar);
      if (Array.isArray(user.education)) setEducationList(user.education);
      if (Array.isArray(user.experience)) setExperienceList(user.experience);
      if (Array.isArray(user.projects)) setProjectsList(user.projects);
      if (Array.isArray(user.certifications)) setCertificationsList(user.certifications);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Skill Add & Remove
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (formData.skills.includes(skillInput.trim())) {
      showError("Skill already added");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, skillInput.trim()],
    }));
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Education Handlers
  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!eduForm.institution || !eduForm.level) {
      showError("Institution and level are required");
      return;
    }
    setEducationList((prev) => [...prev, eduForm]);
    setEduForm({ level: "UG", institution: "", degree: "", fieldOfStudy: "", passingYear: "", grade: "" });
    setShowEduForm(false);
  };

  const handleRemoveEducation = (index) => {
    setEducationList((prev) => prev.filter((_, i) => i !== index));
  };

  // Experience Handlers
  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!expForm.title || !expForm.company) {
      showError("Job Title and Company are required");
      return;
    }
    setExperienceList((prev) => [...prev, expForm]);
    setExpForm({ title: "", company: "", location: "", startDate: "", endDate: "", isCurrent: false, description: "" });
    setShowExpForm(false);
  };

  const handleRemoveExperience = (index) => {
    setExperienceList((prev) => prev.filter((_, i) => i !== index));
  };

  // Project Handlers
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!projForm.title) {
      showError("Project Title is required");
      return;
    }
    setProjectsList((prev) => [...prev, projForm]);
    setProjForm({ title: "", description: "", technologies: "", link: "" });
    setShowProjForm(false);
  };

  const handleRemoveProject = (index) => {
    setProjectsList((prev) => prev.filter((_, i) => i !== index));
  };

  // Certification Handlers
  const handleAddCertification = (e) => {
    e.preventDefault();
    if (!certForm.title || !certForm.issuer) {
      showError("Certificate Title and Issuer are required");
      return;
    }
    setCertificationsList((prev) => [...prev, certForm]);
    setCertForm({ title: "", issuer: "", issueDate: "", credentialUrl: "" });
    setShowCertForm(false);
  };

  const handleRemoveCertification = (index) => {
    setCertificationsList((prev) => prev.filter((_, i) => i !== index));
  };

  // Avatar & Resume Files
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("bio", formData.bio);
      data.append("location", formData.location);
      data.append("contactNumber", formData.contactNumber);
      data.append("gender", formData.gender);
      data.append("dob", formData.dob);
      data.append("skills", JSON.stringify(formData.skills));

      // Append array fields as JSON strings
      data.append("education", JSON.stringify(educationList));
      data.append("experience", JSON.stringify(experienceList));
      data.append("projects", JSON.stringify(projectsList));
      data.append("certifications", JSON.stringify(certificationsList));

      if (avatarFile) data.append("avatar", avatarFile);
      if (resumeFile) data.append("resume", resumeFile);

      await onProfileUpdated(data);
      showSuccess("Full profile saved successfully!");
    } catch (err) {
      showError(err.message || "Failed to save profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 max-w-5xl mx-auto space-y-8">
      <div className="pb-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manage Candidate Profile</h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete basic details, education, work experience, projects, and certifications
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ================= SECTION 1: BASIC & PERSONAL DETAILS ================= */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <User size={18} className="text-blue-600" /> Basic & Personal Details
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-200/60">
            <div className="relative shrink-0">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-black text-3xl flex items-center justify-center border-4 border-white shadow-md">
                  {formData.username ? formData.username.charAt(0).toUpperCase() : "U"}
                </div>
              )}

              <label className="absolute bottom-0 right-0 p-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full cursor-pointer shadow-lg transition">
                <Camera size={15} />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>

            <div className="w-full space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth (DOB)</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State, Country"
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Bio</label>
            <textarea
              name="bio"
              rows={2}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Brief introduction..."
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* ================= SECTION 2: SKILLS ================= */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <FileText size={18} className="text-indigo-600" /> Skills & Competencies
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add skill (e.g. React, Java, Python)..."
              className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-10 p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            {formData.skills.length === 0 ? (
              <span className="text-xs text-slate-400">No skills added yet.</span>
            ) : (
              formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-[#2B2A8C] border border-blue-200 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5"
                >
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-rose-600">
                    <X size={14} />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* ================= SECTION 3: EDUCATION (10th, 12th, UG, PG) ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap size={18} className="text-purple-600" /> Education (10th, 12th, UG, PG)
            </h3>
            <button
              type="button"
              onClick={() => setShowEduForm(!showEduForm)}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add Education
            </button>
          </div>

          {/* ADD EDUCATION FORM */}
          {showEduForm && (
            <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-2xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-purple-900">Add Education Entry</h4>
                <button type="button" onClick={() => setShowEduForm(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Education Level</label>
                  <select
                    value={eduForm.level}
                    onChange={(e) => setEduForm({ ...eduForm, level: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="10th">10th Standard (SSLC / CBSE)</option>
                    <option value="12th">12th Standard (HSC / CBSE)</option>
                    <option value="UG">UG (Bachelor's Degree)</option>
                    <option value="PG">PG (Master's Degree)</option>
                    <option value="Diploma">Diploma / Vocational</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Institution / School / College</label>
                  <input
                    type="text"
                    placeholder="e.g. St. Xavier High School / ABC University"
                    value={eduForm.institution}
                    onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Degree / Course Name</label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech / High School Diploma"
                    value={eduForm.degree}
                    onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Field of Study / Branch</label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science / Science"
                    value={eduForm.fieldOfStudy}
                    onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Passing Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2024"
                    value={eduForm.passingYear}
                    onChange={(e) => setEduForm({ ...eduForm, passingYear: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Grade / CGPA / %</label>
                  <input
                    type="text"
                    placeholder="e.g. 8.5 CGPA or 88%"
                    value={eduForm.grade}
                    onChange={(e) => setEduForm({ ...eduForm, grade: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition"
                >
                  Save Entry
                </button>
              </div>
            </div>
          )}

          {/* EDUCATION LIST */}
          <div className="space-y-2">
            {educationList.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No education entries added yet.</p>
            ) : (
              educationList.map((edu, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-purple-100 text-purple-700 font-extrabold text-[10px] px-2 py-0.5 rounded">
                        {edu.level}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs">{edu.institution}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""} • Passed {edu.passingYear || "N/A"} {edu.grade ? `(${edu.grade})` : ""}
                    </p>
                  </div>
                  <button type="button" onClick={() => handleRemoveEducation(idx)} className="text-slate-400 hover:text-rose-600 p-1">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================= SECTION 4: WORK EXPERIENCE & INTERNSHIPS ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase size={18} className="text-emerald-600" /> Work Experience & Internships
            </h3>
            <button
              type="button"
              onClick={() => setShowExpForm(!showExpForm)}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add Experience
            </button>
          </div>

          {/* ADD EXPERIENCE FORM */}
          {showExpForm && (
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-900">Add Experience / Internship</h4>
                <button type="button" onClick={() => setShowExpForm(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Role / Position Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Intern"
                    value={expForm.title}
                    onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Tech Solutions"
                    value={expForm.company}
                    onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Remote / New York"
                    value={expForm.location}
                    onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="month"
                    value={expForm.startDate}
                    onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="month"
                    disabled={expForm.isCurrent}
                    value={expForm.endDate}
                    onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCurrent"
                  checked={expForm.isCurrent}
                  onChange={(e) => setExpForm({ ...expForm, isCurrent: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <label htmlFor="isCurrent" className="text-xs text-slate-700 font-medium">Currently working here</label>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Key Responsibilities & Achievements</label>
                <textarea
                  rows={2}
                  placeholder="Describe your role and key outcomes..."
                  value={expForm.description}
                  onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition"
                >
                  Save Experience
                </button>
              </div>
            </div>
          )}

          {/* EXPERIENCE LIST */}
          <div className="space-y-2">
            {experienceList.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No work experience or internships added yet.</p>
            ) : (
              experienceList.map((exp, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{exp.title} at {exp.company}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate || "N/A"} • {exp.location || "Remote"}
                    </p>
                    {exp.description && <p className="text-[11px] text-slate-600 mt-1 italic">{exp.description}</p>}
                  </div>
                  <button type="button" onClick={() => handleRemoveExperience(idx)} className="text-slate-400 hover:text-rose-600 p-1">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================= SECTION 5: PROJECTS ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FolderGit2 size={18} className="text-amber-600" /> Key Projects
            </h3>
            <button
              type="button"
              onClick={() => setShowProjForm(!showProjForm)}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add Project
            </button>
          </div>

          {/* ADD PROJECT FORM */}
          {showProjForm && (
            <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-900">Add Project Entry</h4>
                <button type="button" onClick={() => setShowProjForm(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Project Title</label>
                  <input
                    type="text"
                    placeholder="e.g. E-Commerce Platform"
                    value={projForm.title}
                    onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Technologies Used</label>
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, MongoDB"
                    value={projForm.technologies}
                    onChange={(e) => setProjForm({ ...projForm, technologies: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Project Link / GitHub URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/username/project"
                  value={projForm.link}
                  onChange={(e) => setProjForm({ ...projForm, link: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Project Description</label>
                <textarea
                  rows={2}
                  placeholder="Short summary of features built..."
                  value={projForm.description}
                  onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition"
                >
                  Save Project
                </button>
              </div>
            </div>
          )}

          {/* PROJECTS LIST */}
          <div className="space-y-2">
            {projectsList.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No project portfolio entries added yet.</p>
            ) : (
              projectsList.map((proj, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-xs">{proj.title}</h4>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline text-[11px] flex items-center gap-0.5">
                          Link <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                    {proj.technologies && <p className="text-[11px] text-slate-500 mt-0.5">Tech: {proj.technologies}</p>}
                    {proj.description && <p className="text-[11px] text-slate-600 mt-1">{proj.description}</p>}
                  </div>
                  <button type="button" onClick={() => handleRemoveProject(idx)} className="text-slate-400 hover:text-rose-600 p-1">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================= SECTION 6: CERTIFICATIONS ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award size={18} className="text-rose-600" /> Certifications & Licenses
            </h3>
            <button
              type="button"
              onClick={() => setShowCertForm(!showCertForm)}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add Certification
            </button>
          </div>

          {/* ADD CERTIFICATION FORM */}
          {showCertForm && (
            <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-2xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-rose-900">Add Certificate Entry</h4>
                <button type="button" onClick={() => setShowCertForm(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Certificate Title</label>
                  <input
                    type="text"
                    placeholder="e.g. AWS Certified Developer"
                    value={certForm.title}
                    onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Issuing Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Amazon Web Services / Coursera"
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Issue Date</label>
                  <input
                    type="month"
                    value={certForm.issueDate}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Credential URL</label>
                <input
                  type="url"
                  placeholder="https://credential-verify-link.com"
                  value={certForm.credentialUrl}
                  onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleAddCertification}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition"
                >
                  Save Certification
                </button>
              </div>
            </div>
          )}

          {/* CERTIFICATIONS LIST */}
          <div className="space-y-2">
            {certificationsList.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No certificates added yet.</p>
            ) : (
              certificationsList.map((cert, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-xs">{cert.title}</h4>
                      {cert.credentialUrl && (
                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:underline text-[11px] flex items-center gap-0.5">
                          Verify <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Issued by {cert.issuer} • {cert.issueDate || "Date N/A"}
                    </p>
                  </div>
                  <button type="button" onClick={() => handleRemoveCertification(idx)} className="text-slate-400 hover:text-rose-600 p-1">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================= SECTION 7: RESUME UPLOAD ================= */}
        <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-3">
          <label className="block text-sm font-bold text-slate-900">
            Resume / CV Document
          </label>

          {user?.resume ? (
            <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-blue-200 shadow-2xs">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-600 shrink-0" size={22} />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {user.resumeOriginalName || "Candidate_Resume.pdf"}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 size={12} /> Active Resume File attached
                  </p>
                </div>
              </div>
              <a
                href={user.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg transition"
              >
                View
              </a>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              Upload your latest resume (PDF or DOCX format) to submit applications with 1-click.
            </p>
          )}

          <div className="flex items-center gap-3">
            <input
              type="file"
              id="resumeUpload"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              className="hidden"
            />
            <label
              htmlFor="resumeUpload"
              className="px-4 py-2.5 bg-white border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2"
            >
              <Upload size={15} /> Select New Resume File
            </label>
            {resumeFile && (
              <span className="text-xs text-slate-600 font-semibold truncate max-w-xs">
                Selected: {resumeFile.name}
              </span>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Save size={18} />
            {submitting ? "Saving Profile..." : "Save Full Profile Details"}
          </button>
        </div>
      </form>
    </div>
  );
}
