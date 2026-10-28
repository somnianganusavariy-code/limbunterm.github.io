import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  DollarSign, 
  Download, 
  PlusCircle, 
  Trash2, 
  Search, 
  ArrowLeft,
  ExternalLink,
  Mail,
  RefreshCw,
  Sliders,
  Edit3,
  Lock,
  Unlock,
  ShieldCheck,
  Share2,
  Check
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { InquiryStatus, Project } from '../types';

export const DashboardView: React.FC = () => {
  const { 
    setCurrentView,
    projects, 
    inquiries, 
    totalPortfolioViews, 
    updateInquiryStatus, 
    deleteInquiry, 
    exportInquiriesCSV,
    simulateVisitor,
    addInquiry,
    setSelectedProject,
    openForWork,
    setOpenForWork,
    isOwnerMode,
    setIsPinModalOpen,
    setEditingProject,
    setIsProjectEditorOpen,
    setIsStudioProfileEditorOpen,
    lockOwnerMode
  } = usePortfolio();

  const [inquiryFilter, setInquiryFilter] = useState<'All' | InquiryStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Compute stats
  const totalProjectViewsSum = projects.reduce((acc, p) => acc + p.views, 0);
  const totalLikesSum = projects.reduce((acc, p) => acc + p.likes, 0);
  const newInquiriesCount = inquiries.filter(i => i.status === 'New').length;
  const bookedInquiriesCount = inquiries.filter(i => i.status === 'Booked').length;
  
  // Pipeline estimation based on budget strings
  const pipelineValue = inquiries.reduce((sum, item) => {
    if (item.status === 'Archived') return sum;
    if (item.budget.includes('$25k')) return sum + 25000;
    if (item.budget.includes('$10k')) return sum + 12000;
    if (item.budget.includes('$5k')) return sum + 7500;
    return sum + 3500;
  }, 0);

  const conversionRate = totalPortfolioViews > 0 
    ? ((inquiries.length / totalPortfolioViews) * 100).toFixed(2) 
    : '2.4';

  const filteredInquiries = inquiries.filter(item => {
    const matchesFilter = inquiryFilter === 'All' ? true : item.status === inquiryFilter;
    const matchesSearch = 
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.company && item.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSimulateInbound = () => {
    const brands = [
      { name: 'Kasper Holm', email: 'kasper@aetheraudio.dk', company: 'Aether Hi-Fi', service: 'Packaging', budget: '$10k - $25k', timeline: '3 - 4 weeks', msg: 'Need luxury unboxing packaging and aluminum chassis badge graphics.' },
      { name: 'Yuki Tanaka', email: 'yuki@sora-tea.jp', company: 'Sora Organic Matcha', service: 'Brand Identity', budget: '$5k - $10k', timeline: '1 - 2 months', msg: 'Seeking minimalist Japanese-Nordic packaging and foil stamped tins.' },
      { name: 'Amara Diallo', email: 'amara@atelier-noir.com', company: 'Atelier Noir Studio', service: 'Graphic Design', budget: '$5k - $10k', timeline: 'Within 2 weeks', msg: 'Looking for an editorial art director for an architecture monograph launch.' }
    ];
    const picked = brands[Math.floor(Math.random() * brands.length)];
    addInquiry({
      clientName: picked.name,
      email: picked.email,
      company: picked.company,
      service: picked.service,
      budget: picked.budget,
      timeline: picked.timeline,
      message: picked.msg
    });
  };

  const handleOpenUploadNew = () => {
    if (!isOwnerMode) {
      setIsPinModalOpen(true);
      return;
    }
    setEditingProject(null);
    setIsProjectEditorOpen(true);
  };

  const handleOpenEditProject = (project: Project) => {
    if (!isOwnerMode) {
      setIsPinModalOpen(true);
      return;
    }
    setEditingProject(project);
    setIsProjectEditorOpen(true);
  };

  const handleOpenStudioProfile = () => {
    if (!isOwnerMode) {
      setIsPinModalOpen(true);
      return;
    }
    setIsStudioProfileEditorOpen(true);
  };

  const copyViewOnlyLink = () => {
    const origin = window.location.origin;
    const viewOnlyUrl = `${origin}?readonly=true`;
    navigator.clipboard.writeText(viewOnlyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F6F6F4] text-zinc-900 pb-20">
      
      {/* Dashboard Sub-Header */}
      <div className="bg-white border-b border-zinc-200 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('portfolio')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portfolio</span>
            </button>

            <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-zinc-950 tracking-tight">
                Studio Management &amp; Analytics
              </h1>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                isOwnerMode 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-zinc-100 text-zinc-600 border-zinc-200'
              }`}>
                {isOwnerMode ? 'Owner Access' : 'View-Only'}
              </span>
            </div>
          </div>

          {/* Quick Studio Actions */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Upload New Project */}
            <button
              onClick={handleOpenUploadNew}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#EA580C] hover:bg-[#D94F04] text-white shadow-xs transition-all"
              title="Upload new image and add a new graphic design project"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Upload New Project</span>
            </button>

            {/* Edit Studio Profile */}
            <button
              onClick={handleOpenStudioProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50 text-zinc-800 transition-all"
              title="Edit studio name, headline, contact info, and metrics"
            >
              <Sliders className="w-3.5 h-3.5 text-zinc-500" />
              <span>Edit Studio Info</span>
            </button>

            {/* Availability Toggle */}
            <button
              onClick={() => {
                if (!isOwnerMode) {
                  setIsPinModalOpen(true);
                  return;
                }
                setOpenForWork(!openForWork);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                openForWork 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-zinc-100 border-zinc-300 text-zinc-600'
              }`}
              title="Toggle studio status badge shown on website hero"
            >
              <span className={`w-2 h-2 rounded-full ${openForWork ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
              <span>{openForWork ? 'Accepting Clients' : 'Fully Booked'}</span>
            </button>

            {/* Share View-Only Link */}
            <button
              onClick={copyViewOnlyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-colors"
              title="Copy view-only client link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-zinc-500" />}
              <span>{copiedLink ? 'Copied!' : 'Share Link'}</span>
            </button>

            {/* Lock / Unlock Toggle */}
            <button
              onClick={() => {
                if (isOwnerMode) {
                  lockOwnerMode();
                } else {
                  setIsPinModalOpen(true);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
              title={isOwnerMode ? "Switch to View-Only mode" : "Unlock Owner Mode"}
            >
              {isOwnerMode ? <Unlock className="w-3 h-3 text-[#EA580C]" /> : <Lock className="w-3 h-3 text-zinc-500" />}
              <span>{isOwnerMode ? 'Lock' : 'Unlock PIN'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* View-Only Alert for Visitors */}
        {!isOwnerMode && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-orange-950">
            <div>
              <p className="font-bold text-sm text-[#C2410C]">
                Viewing in Client / View-Only Mode
              </p>
              <p className="text-zinc-600 mt-0.5">
                Public viewers have read-only permissions and cannot modify projects, upload images, or delete inquiries.
              </p>
            </div>
            <button
              onClick={() => setIsPinModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-white font-semibold text-xs shrink-0 shadow-xs"
            >
              Enter Studio PIN to Edit
            </button>
          </div>
        )}

        {/* KPI Cards Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Portfolio Views</span>
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#EA580C] flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-zinc-950">
                {totalPortfolioViews.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-emerald-600 flex items-center">
                +14.8% vs last mo
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-2">Combined home, gallery &amp; mobile impressions</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Project Impressions</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-zinc-950">
                {totalProjectViewsSum.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-zinc-500">
                ({totalLikesSum} client likes)
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-2">Across all {projects.length} featured graphic design projects</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Client Inquiries</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-zinc-950">
                {inquiries.length}
              </span>
              {newInquiriesCount > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#EA580C]">
                  {newInquiriesCount} new action
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-2">{bookedInquiriesCount} deals booked into production</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Pipeline Estimation</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-zinc-950">
                ${pipelineValue.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                {conversionRate}% conv
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-2">Active inbound proposal deal volume</p>
          </div>

        </div>

        {/* Section 1: Project Views Leaderboard & Edit Operations */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                Portfolio Manager
              </span>
              <h2 className="text-xl font-bold text-zinc-950">
                Projects Showcase ({projects.length} Published)
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenUploadNew}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#EA580C] hover:bg-[#D94F04] text-white shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>

              <button
                onClick={simulateVisitor}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                title="Add a real-time simulated visitor pageview"
              >
                <RefreshCw className="w-3 h-3 text-zinc-500" />
                <span>+1 Sim View</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-xs text-zinc-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Project</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold text-right">Views</th>
                  <th className="pb-3 font-semibold text-right">Likes</th>
                  <th className="pb-3 font-semibold">Popularity Gauge</th>
                  <th className="pb-3 font-semibold text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {[...projects]
                  .sort((a, b) => b.views - a.views)
                  .map((project) => {
                    const maxViews = Math.max(...projects.map(p => p.views));
                    const percentage = Math.round((project.views / maxViews) * 100);

                    return (
                      <tr key={project.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={project.image}
                              alt={project.title}
                              referrerPolicy="no-referrer"
                              className="w-12 h-9 object-cover rounded-lg border border-zinc-200 shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-zinc-900 line-clamp-1">{project.title}</p>
                              <p className="text-xs text-zinc-500 font-mono">{project.client}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700">
                            {project.category}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-right font-mono font-bold text-zinc-900">
                          {project.views.toLocaleString()}
                        </td>
                        <td className="py-3.5 pr-4 text-right font-mono text-zinc-600">
                          {project.likes}
                        </td>
                        <td className="py-3.5 pr-4 w-44">
                          <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#EA580C] h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-zinc-400 font-mono mt-0.5 block">{percentage}% top</span>
                        </td>
                        <td className="py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProject(project)}
                              className="inline-flex items-center gap-1 text-xs text-zinc-700 hover:text-zinc-950 font-semibold px-2.5 py-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50"
                              title="Edit project images, title, details"
                            >
                              <Edit3 className="w-3 h-3 text-zinc-500" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => setSelectedProject(project)}
                              className="inline-flex items-center gap-1 text-xs text-[#EA580C] hover:text-[#C2410C] font-semibold px-2.5 py-1 rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100"
                              title="Inspect high-resolution modal"
                            >
                              <span>View</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Inquiries Tracking & Management */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs">
          
          {/* Header & Filter Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                Lead Pipeline
              </span>
              <h2 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
                Visitor Inquiries &amp; Project Briefs
                <span className="text-xs font-normal text-zinc-500">
                  ({filteredInquiries.length} results)
                </span>
              </h2>
            </div>

            {/* Search, Status Filters & Test Inbound */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSimulateInbound}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors"
                title="Generate a realistic incoming client brief"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Simulate Inbound</span>
              </button>

              <button
                onClick={exportInquiriesCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-zinc-300 hover:bg-zinc-100 text-zinc-700 transition-colors"
                title="Download client inquiries as spreadsheet"
              >
                <Download className="w-3.5 h-3.5 text-zinc-500" />
                <span>CSV</span>
              </button>

              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search client, email or brand..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 rounded-full border border-zinc-200 text-xs w-52 sm:w-60 outline-none focus:border-[#EA580C]"
                />
              </div>

              {/* Status segmented tabs */}
              <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-full border border-zinc-200">
                {(['All', 'New', 'In Discussion', 'Booked', 'Archived'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setInquiryFilter(tab)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      inquiryFilter === tab
                        ? 'bg-white text-zinc-950 shadow-xs font-semibold'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    {tab}
                    {tab === 'New' && newInquiriesCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#EA580C] text-white text-[10px]">
                        {newInquiriesCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Inquiries List */}
          {filteredInquiries.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 border border-dashed border-zinc-200 rounded-2xl">
              <MessageSquare className="w-8 h-8 mx-auto text-zinc-300 mb-2" />
              <p className="text-sm font-semibold">No inquiries match the current filter.</p>
              <p className="text-xs text-zinc-400 mt-1">Try simulating a new inquiry using the top button.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredInquiries.map(inquiry => {
                const getStatusBadge = (status: InquiryStatus) => {
                  switch (status) {
                    case 'New':
                      return 'bg-orange-100 text-[#EA580C] border-orange-200';
                    case 'In Discussion':
                      return 'bg-blue-50 text-blue-700 border-blue-200';
                    case 'Booked':
                      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    case 'Archived':
                    default:
                      return 'bg-zinc-100 text-zinc-600 border-zinc-200';
                  }
                };

                return (
                  <div
                    key={inquiry.id}
                    className="border border-zinc-200 rounded-2xl p-4 sm:p-5 hover:border-zinc-300 transition-all bg-zinc-50/50 hover:bg-white"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h4 className="font-bold text-zinc-900 text-base">{inquiry.clientName}</h4>
                          {inquiry.company && (
                            <span className="text-xs text-zinc-500 font-medium">
                              at <span className="text-zinc-800">{inquiry.company}</span>
                            </span>
                          )}
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(inquiry.status)}`}>
                            {inquiry.status}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>{inquiry.email}</span>
                          <span>·</span>
                          <span className="font-medium text-zinc-700">{inquiry.service}</span>
                          <span>·</span>
                          <span className="font-mono text-[#EA580C]">{inquiry.budget}</span>
                          <span>·</span>
                          <span>{inquiry.timeline}</span>
                          <span>·</span>
                          <span className="font-mono text-zinc-400">{inquiry.date}</span>
                        </p>
                      </div>

                      {/* Status changer & Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isOwnerMode ? (
                          <>
                            <select
                              value={inquiry.status}
                              onChange={e => updateInquiryStatus(inquiry.id, e.target.value as InquiryStatus)}
                              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-700 outline-none focus:border-[#EA580C]"
                            >
                              <option value="New">Mark New</option>
                              <option value="In Discussion">Mark In Discussion</option>
                              <option value="Booked">Mark Booked</option>
                              <option value="Archived">Archive</option>
                            </select>

                            <button
                              onClick={() => deleteInquiry(inquiry.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-zinc-400 hover:text-rose-600 border border-zinc-200 bg-white transition-colors"
                              title="Delete inquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : null}

                        <a
                          href={`mailto:${inquiry.email}?subject=Regarding your ${inquiry.service} inquiry with Talmeez&body=Hi ${inquiry.clientName},%0D%0A%0D%0AThank you for reaching out regarding your project for ${inquiry.company || 'your brand'}...`}
                          className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200 bg-white"
                          title="Reply directly via email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    {/* Inbound Message Brief */}
                    <div className="mt-3 pt-3 border-t border-zinc-200/60 text-xs sm:text-sm text-zinc-700 leading-relaxed bg-white p-3.5 rounded-xl border border-zinc-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                        Client Project Brief:
                      </span>
                      {inquiry.message}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Section 3: Referral Traffic Sources & Engagement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
              Acquisition Channels
            </span>
            <h3 className="text-lg font-bold text-zinc-950 mb-4">
              Top Referring Platforms
            </h3>
            <div className="space-y-3.5">
              {[
                { name: 'Behance Network', share: '38%', count: '5,031 visits' },
                { name: 'Direct / Portfolio Link', share: '26%', count: '3,442 visits' },
                { name: 'Instagram & Threads', share: '18%', count: '2,383 visits' },
                { name: 'Dribbble Pro', share: '12%', count: '1,588 visits' },
                { name: 'LinkedIn Creator', share: '6%', count: '796 visits' }
              ].map((channel, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
                    <span className="font-semibold text-zinc-800">{channel.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 font-mono">{channel.count}</span>
                    <span className="font-mono font-bold text-zinc-900 w-10 text-right">{channel.share}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                Security &amp; Permissions
              </span>
              <h3 className="text-lg font-bold text-zinc-950 mb-2">
                Shareable View-Only Mode
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                When sharing your portfolio with clients, they can view all high-resolution galleries, browse works, and submit project inquiries without any editing rights or access to private analytics.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Protected with Studio PIN ({isOwnerMode ? 'Unlocked' : 'Locked'})</span>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
              <button
                onClick={copyViewOnlyLink}
                className="text-xs font-semibold text-[#EA580C] hover:underline flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy View-Only Link</span>
              </button>

              <button
                onClick={() => setCurrentView('portfolio')}
                className="bg-zinc-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              >
                View Live Portfolio
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
