import React from "react";
import { RefreshCw, Plus, X, Sparkles } from "lucide-react";

export default function JobFormTab({
  editingJob,
  jobForm,
  setJobForm,
  handleJobSubmit,
  formSubmitting,
  resetForm,
  handleTabSwitch
}) {
  const popularSkills = [
  "Communication",
  "Customer Service",
  "Sales",
  "Business Development",
  "Recruitment",
  "Marketing",
  "Digital Marketing",
  "Telecalling",
  "Inside Sales",
  "Product Advisory",
  "Operations",
  "MS Excel"
];

  const currentSkillsList = typeof jobForm.skills === 'string'
    ? jobForm.skills.split(',').map(s => s.trim()).filter(Boolean)
    : Array.isArray(jobForm.skills)
    ? jobForm.skills
    : [];

  const toggleSkill = (skillToToggle) => {
    let updated;
    if (currentSkillsList.some(s => s.toLowerCase() === skillToToggle.toLowerCase())) {
      updated = currentSkillsList.filter(s => s.toLowerCase() !== skillToToggle.toLowerCase());
    } else {
      updated = [...currentSkillsList, skillToToggle];
    }
    setJobForm({ ...jobForm, skills: updated.join(', ') });
  };

  const removeSkill = (skillToRemove) => {
    const updated = currentSkillsList.filter(s => s.toLowerCase() !== skillToRemove.toLowerCase());
    setJobForm({ ...jobForm, skills: updated.join(', ') });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm animate-fadeIn">
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {editingJob ? "Edit Job Posting" : "Create New Job Opening"}
        </h2>
        <p className="text-slate-500 text-xs mt-1">
          Fill in the details below to publish your job opening and reach top candidates.
        </p>
      </div>

      <form onSubmit={handleJobSubmit} className="space-y-6">
        {/* Row 1: Title & Company */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Job Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Frontend Engineer"
              value={jobForm.title}
              onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/10 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. TechCorp Solutions"
              value={jobForm.company}
              onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/10 transition"
            />
          </div>
        </div>

        {/* Row 2: Category, Min Education, Company Logo URL */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Role Category
            </label>
            <select
              value={jobForm.category}
              onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/10 transition"
            >
            
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
              <option value="Management">Management</option>
              <option value="Operations">Operations</option>
              <option value="Sales">Sales</option>
              <option value="Customer Support">Customer Support</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Min Education Required
            </label>
            <select
              value={jobForm.minEducation}
              onChange={(e) => setJobForm({ ...jobForm, minEducation: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/10 transition"
            >
              <option value="High School / 10+2">High School / 10+2</option>
              <option value="Diploma">Diploma</option>
              <option value="Bachelor's Degree">Bachelor's Degree (B.Tech / B.E / B.Sc / BCA...)</option>
              <option value="Master's Degree">Master's Degree (M.Tech / MBA / MCA...)</option>
              <option value="Doctorate / Ph.D">Doctorate / Ph.D</option>
              <option value="Any Graduate">Any Graduate / No Bar</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Company Logo Image URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="https://company.com/logo.png"
                value={jobForm.companyLogo}
                onChange={(e) => setJobForm({ ...jobForm, companyLogo: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/10 transition"
              />
              {jobForm.companyLogo && (
                <div className="w-10 h-10 rounded-lg border border-slate-200 overflow-hidden shrink-0 bg-white">
                  <img src={jobForm.companyLogo} alt="Logo" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 3: Location, Salary, JobType */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Location <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bengaluru, India"
              value={jobForm.location}
              onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/10 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Salary Range (p.a.)
            </label>
            <input
              type="text"
              placeholder="e.g. 12,00,000 - 18,00,000"
              value={jobForm.salary}
              onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/10 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Job Type
            </label>
            <select
              value={jobForm.jobType}
              onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/10 transition"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        {/* EXPERIENCE REQUIRED SECTION */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Sparkles className="w-4 h-4 text-[#2B2A8C]" />
            Experience Required & Seniority Level
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Work Experience Required (Years) <span className="text-rose-500">*</span>
              </label>
              <select
                value={jobForm.experienceYears || "1 - 3 Years"}
                onChange={(e) => setJobForm({ ...jobForm, experienceYears: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/10 transition"
              >
                <option value="Fresher (0 Years)">Fresher (0 Years)</option>
                <option value="0 - 1 Year">0 - 1 Year</option>
                <option value="1 - 2 Years">1 - 2 Years</option>
                <option value="1 - 3 Years">1 - 3 Years</option>
                <option value="2 - 4 Years">2 - 4 Years</option>
                <option value="3 - 5 Years">3 - 5 Years</option>
                <option value="5 - 8 Years">5 - 8 Years</option>
                <option value="8 - 10 Years">8 - 10 Years</option>
                <option value="10 - 15 Years">10 - 15 Years</option>
                <option value="15+ Years">15+ Years</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Role Seniority Level
              </label>
              <select
                value={jobForm.experienceLevel || "Mid Level (2-5 Yrs)"}
                onChange={(e) => setJobForm({ ...jobForm, experienceLevel: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/10 transition"
              >
                <option value="Fresher / Entry Level (0-1 Yrs)">Fresher / Entry Level (0 - 1 Yrs)</option>
                <option value="Junior Level (1-3 Yrs)">Junior Level (1 - 3 Yrs)</option>
                <option value="Mid Level (2-5 Yrs)">Mid Level (2 - 5 Yrs)</option>
                <option value="Senior Level (5-8 Yrs)">Senior Level (5 - 8 Yrs)</option>
                <option value="Lead / Principal (8-12 Yrs)">Lead / Principal (8 - 12 Yrs)</option>
                <option value="Manager / Director (10+ Yrs)">Manager / Director (10+ Yrs)</option>
                <option value="Executive / VP (15+ Yrs)">Executive / VP (15+ Yrs)</option>
              </select>
            </div>
          </div>
        </div>

        {/* KEY SKILLS & CORE TECH STACK SECTION */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Key Skills / Core Tech Stack (Comma separated or click badges)
            </label>
            <p className="text-slate-500 text-xs mb-3">
              Add technical skills or required competencies for candidate matching.
            </p>
            <input
              type="text"
              placeholder="e.g. React.js, Node.js, TypeScript, MongoDB, AWS"
              value={jobForm.skills || ""}
              onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/10 transition"
            />
          </div>

          {/* Selected Skills Tags */}
          {currentSkillsList.length > 0 && (
            <div>
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Selected Skills ({currentSkillsList.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {currentSkillsList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2B2A8C] text-white text-xs font-semibold rounded-lg shadow-xs"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:bg-white/20 p-0.5 rounded-full transition cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Popular Skill Quick Add Chips */}
          <div>
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Click Popular Skill Badges to Add / Remove:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {popularSkills.map((popSkill) => {
                const isSelected = currentSkillsList.some(s => s.toLowerCase() === popSkill.toLowerCase());
                return (
                  <button
                    key={popSkill}
                    type="button"
                    onClick={() => toggleSkill(popSkill)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? "bg-blue-100 text-[#2B2A8C] border-blue-300 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected ? <X className="w-3 h-3 text-[#2B2A8C]" /> : <Plus className="w-3 h-3 text-slate-400" />}
                    {popSkill}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Job Description & About Company */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Job Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Provide an overview of the role, team responsibilities, and expected outcomes..."
              value={jobForm.description}
              onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 outline-none focus:bg-white focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/10 transition leading-relaxed"
            />
          </div> */}
              <div>
  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
    Job Description <span className="text-rose-500">*</span>
  </label>
  <textarea
    required
    rows={4}
    placeholder="Provide an overview of the role, team responsibilities, and expected outcomes..."
    value={jobForm.description}
    onChange={(e) => {
      const text = e.target.value;
      const wordCount = text.trim().split(/\s+/).length;
      if (wordCount <= 150) {
        setJobForm({ ...jobForm, description: text });
      }
    }}
    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 outline-none focus:bg-white focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/10 transition leading-relaxed"
  />
  <p className="text-xs text-slate-500 mt-1">
    Word count: {jobForm.description.trim().split(/\s+/).length} / 150
    {jobForm.description.trim().split(/\s+/).length < 100 && " (minimum 100 words required)"}
  </p>
</div>


          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              About the Company (Optional)
            </label>
            <textarea
              rows={4}
              placeholder="Describe your company culture, mission, team size, or background story..."
              value={jobForm.aboutCompany}
              onChange={(e) => setJobForm({ ...jobForm, aboutCompany: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 outline-none focus:bg-white focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/10 transition leading-relaxed"
            />
          </div>
        </div>

        {/* Requirements & Benefits */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Key Requirements (One per line)
            </label>
            <textarea
              rows={4}
              placeholder="3+ years of React.js experience&#10;Proficiency with Node.js & REST APIs&#10;Strong Problem Solving skills"
              value={jobForm.requirements}
              onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/10 transition leading-relaxed font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Perks & Benefits (One per line)
            </label>
            <textarea
              rows={4}
              placeholder="Flexible working hours&#10;Comprehensive Health Insurance&#10;Annual Learning & Wellness Allowance"
              value={jobForm.benefits}
              onChange={(e) => setJobForm({ ...jobForm, benefits: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/10 transition leading-relaxed font-mono"
            />
          </div>
        </div>

        {/* Screening Questions */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Candidate Screening Questions (Optional, One per line)
          </label>
          <textarea
            rows={3}
            placeholder="How many years of experience do you have with React?&#10;What is your notice period?"
            value={jobForm.screeningQuestions}
            onChange={(e) => setJobForm({ ...jobForm, screeningQuestions: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#2B2A8C] focus:ring-2 focus:ring-[#2B2A8C]/10 transition leading-relaxed"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              resetForm();
              handleTabSwitch("my-jobs");
            }}
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={formSubmitting}
            className="px-8 py-3.5 rounded-xl bg-[#2B2A8C] hover:bg-[#1E1D66] disabled:opacity-50 text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center gap-2"
          >
            {formSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Submitting...
              </>
            ) : editingJob ? (
              "Save Changes"
            ) : (
              "Publish Job Posting"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
