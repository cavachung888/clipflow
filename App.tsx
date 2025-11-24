
import React, { useState, useRef, useEffect } from 'react';
import { ProcessingStatus } from './types';
import { extractUrlFromText, fetchDouyinVideo, downloadVideoAsBlob } from './services/douyinService';
import { transcribeAudio, rewriteScript } from './services/geminiService';
import { Button } from './components/Button';
import { translations } from './translations';
import { 
  Upload, 
  Link as LinkIcon, 
  FileVideo, 
  Wand2, 
  ArrowRight, 
  Loader2, 
  FileText,
  CheckCircle2,
  Languages,
  Zap,
  Globe,
  MessageSquare,
  Sparkles,
  ChevronDown,
  Play,
  RotateCcw
} from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'zh'>('zh');
  const t = translations[lang];

  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Inputs
  const [inputText, setInputText] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [rewriteInstruction, setRewriteInstruction] = useState(t.rewrite.defaultInstruction);

  // Outputs
  const [videoData, setVideoData] = useState<{ url: string, cover: string, title: string } | null>(null);
  const [transcript, setTranscript] = useState('');
  const [rewrittenScript, setRewrittenScript] = useState('');

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workSectionRef = useRef<HTMLDivElement>(null);

  // Update default instruction when language changes
  useEffect(() => {
    if (!rewriteInstruction || rewriteInstruction === translations.en.rewrite.defaultInstruction || rewriteInstruction === translations.zh.rewrite.defaultInstruction) {
      setRewriteInstruction(t.rewrite.defaultInstruction);
    }
  }, [lang, t.rewrite.defaultInstruction, rewriteInstruction]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
      setErrorMsg(null);
      // Reset process if new file
      setTranscript('');
      setRewrittenScript('');
      setVideoData(null);
      setStatus(ProcessingStatus.IDLE);
    }
  };

  const handleReset = () => {
    setInputText('');
    setVideoFile(null);
    setRewriteInstruction(t.rewrite.defaultInstruction);
    setVideoData(null);
    setTranscript('');
    setRewrittenScript('');
    setStatus(ProcessingStatus.IDLE);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartProcess = async () => {
    setErrorMsg(null);
    setTranscript('');
    setRewrittenScript('');
    let currentBlob: Blob | null = null;

    try {
      // 1. Get Video Blob
      if (videoFile) {
        currentBlob = videoFile;
        setVideoData({
          url: URL.createObjectURL(videoFile),
          cover: '',
          title: videoFile.name
        });
      } else if (inputText) {
        setStatus(ProcessingStatus.FETCHING_VIDEO);
        const extractedUrl = extractUrlFromText(inputText);
        
        if (!extractedUrl) {
          throw new Error(t.errors.noLink);
        }

        const data = await fetchDouyinVideo(extractedUrl);
        setVideoData({ url: data.videoUrl, cover: data.cover, title: data.title });
        
        currentBlob = await downloadVideoAsBlob(data.videoUrl);
      } else {
        throw new Error(t.errors.noFile);
      }

      if (!currentBlob) throw new Error(t.errors.downloadFail);

      setStatus(ProcessingStatus.EXTRACTING_AUDIO);
      await new Promise(r => setTimeout(r, 1000)); 
      
      setStatus(ProcessingStatus.TRANSCRIBING);
      const text = await transcribeAudio(currentBlob);
      setTranscript(text);
      
      setStatus(ProcessingStatus.COMPLETED);

    } catch (err: any) {
      setStatus(ProcessingStatus.ERROR);
      setErrorMsg(err.message || t.errors.generic);
    }
  };

  const handleRewrite = async () => {
    if (!transcript) return;
    
    try {
      setStatus(ProcessingStatus.REWRITING);
      const newText = await rewriteScript(transcript, rewriteInstruction);
      setRewrittenScript(newText);
      setStatus(ProcessingStatus.COMPLETED);
    } catch (err: any) {
      setStatus(ProcessingStatus.ERROR);
      setErrorMsg(err.message);
    }
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  const scrollToWork = () => {
    workSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-800">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">ClipFlow</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-brand-600 transition-colors">{t.nav.features}</a>
              <a href="#faq" className="hover:text-brand-600 transition-colors">{t.nav.faq}</a>
            </div>
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors px-3 py-1.5 rounded-full border border-slate-200 hover:border-brand-200"
            >
              <Globe size={14} />
              {lang === 'en' ? '中文' : 'English'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-100/50 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-brand-700 text-sm font-semibold">
            <Sparkles size={14} /> {t.hero.badge}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
            <span className="bg-gradient-to-r from-brand-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              {t.hero.title}
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>
          
          <div className="pt-4">
            <button 
              onClick={scrollToWork}
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-brand-600 px-8 font-medium text-white transition-all duration-300 hover:bg-brand-700 hover:scale-105 shadow-lg shadow-brand-500/30"
            >
              <span>{t.hero.cta}</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Work Area */}
      <section id="workspace" ref={workSectionRef} className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Input & Visualization (Span 5) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                  <LinkIcon className="text-brand-500" size={20} />
                  <h2 className="font-bold text-lg text-slate-800">{t.source.title}</h2>
                </div>

                {/* Text Input */}
                <div className="space-y-4">
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all resize-none h-32 text-slate-700 placeholder:text-slate-400"
                    placeholder={t.source.pastePlaceholder}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={!!videoFile || status === ProcessingStatus.TRANSCRIBING}
                  />

                  {/* Divider OR */}
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                    <div className="relative flex justify-center"><span className="bg-white px-3 text-xs font-bold text-slate-400">{t.source.or}</span></div>
                  </div>

                  {/* Upload Button */}
                  <div>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      onChange={handleFileChange} 
                      accept="video/*" 
                    />
                    {!videoFile ? (
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-slate-300 rounded-xl py-4 flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600 transition-all group"
                      >
                        <Upload className="group-hover:scale-110 transition-transform" size={24} />
                        <span className="font-medium text-sm">{t.source.uploadBtn}</span>
                        <span className="text-xs opacity-70">{t.source.uploadHint}</span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-brand-50 border border-brand-200 rounded-lg">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="bg-brand-200 p-2 rounded text-brand-700"><FileVideo size={18} /></div>
                          <div className="flex-col flex overflow-hidden">
                            <span className="text-xs text-brand-600 font-semibold">{t.source.fileSelected}</span>
                            <span className="text-sm text-brand-900 truncate">{videoFile.name}</span>
                          </div>
                        </div>
                        <button onClick={() => fileInputRef.current?.click()} className="text-xs bg-white border border-brand-200 text-brand-600 px-2 py-1 rounded hover:bg-brand-100">
                          {t.source.changeFile}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-2">
                    <Button 
                      className="flex-1" 
                      onClick={handleStartProcess}
                      isLoading={status !== ProcessingStatus.IDLE && status !== ProcessingStatus.COMPLETED && status !== ProcessingStatus.ERROR}
                      disabled={(!inputText && !videoFile)}
                    >
                      {status === ProcessingStatus.IDLE || status === ProcessingStatus.COMPLETED || status === ProcessingStatus.ERROR ? (
                        <>{t.source.startBtn}</>
                      ) : (
                        status === ProcessingStatus.FETCHING_VIDEO ? t.source.processing.fetching :
                        status === ProcessingStatus.EXTRACTING_AUDIO ? t.source.processing.extracting :
                        status === ProcessingStatus.TRANSCRIBING ? t.source.processing.transcribing : t.source.processing.default
                      )}
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={handleReset}
                      className="px-4 text-slate-500"
                      title={t.source.resetBtn}
                    >
                      <RotateCcw size={20} />
                    </Button>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg animate-fade-in">
                      {errorMsg}
                    </div>
                  )}
                  
                  {/* Video Preview Mini */}
                  {videoData && (
                    <div className="mt-6 border-t border-slate-100 pt-4 animate-slide-up">
                      <div className="flex gap-4">
                         {videoData.cover ? (
                           <img src={videoData.cover} alt="Cover" className="w-20 h-28 object-cover rounded-md shadow-sm bg-slate-200" />
                         ) : (
                           <div className="w-20 h-28 bg-slate-100 rounded-md flex items-center justify-center text-slate-400">
                              <Play size={24} />
                           </div>
                         )}
                         <div className="flex-1 min-w-0">
                           <h4 className="text-sm font-bold text-slate-700 truncate mb-1">{videoData.title || "Video"}</h4>
                           <div className="text-xs text-slate-500 space-y-1">
                             <p className="truncate opacity-70">{videoData.url}</p>
                             <div className="flex gap-2 mt-2">
                               <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 border border-slate-200">FFmpeg</span>
                               <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 border border-slate-200">FunASR</span>
                             </div>
                           </div>
                         </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Right: Output (Span 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Transcript Card */}
              <div className={`bg-white border border-slate-200 rounded-2xl shadow-lg p-6 transition-all duration-500 ${transcript ? 'opacity-100 translate-x-0' : 'opacity-60'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-100 text-orange-600 rounded-md">
                      <FileText size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800">{t.transcript.title}</h3>
                  </div>
                  {transcript && <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 size={12}/> {t.transcript.detected}</span>}
                </div>
                <textarea 
                  readOnly 
                  value={transcript}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 text-sm leading-relaxed h-48 focus:outline-none resize-y"
                  placeholder={t.transcript.placeholder}
                />
              </div>

              {/* Arrow Down */}
              <div className="flex justify-center text-slate-300">
                <ChevronDown className={`transition-all duration-500 ${status === ProcessingStatus.COMPLETED ? 'text-brand-500 scale-110' : ''}`} />
              </div>

              {/* Rewrite Card */}
              <div className={`bg-gradient-to-br from-white to-blue-50 border border-brand-100 rounded-2xl shadow-lg p-6 transition-all duration-500 ${transcript ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <div className="flex items-center gap-2 mb-4 text-brand-700">
                  <div className="p-1.5 bg-brand-100 rounded-md">
                    <Wand2 size={18} />
                  </div>
                  <h3 className="font-bold text-slate-800">{t.rewrite.title}</h3>
                </div>

                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={rewriteInstruction}
                    onChange={(e) => setRewriteInstruction(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none shadow-sm"
                    placeholder={t.rewrite.inputPlaceholder}
                  />
                  <button 
                    onClick={handleRewrite}
                    disabled={status === ProcessingStatus.REWRITING}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex items-center whitespace-nowrap shadow-md shadow-brand-600/20"
                  >
                    {status === ProcessingStatus.REWRITING ? <Loader2 className="animate-spin" /> : t.rewrite.btn}
                  </button>
                </div>

                <div className="relative">
                  <textarea 
                    value={rewrittenScript}
                    readOnly
                    className="w-full bg-white border border-brand-200/50 rounded-xl p-4 text-slate-800 text-sm leading-relaxed h-56 focus:outline-none shadow-inner"
                    placeholder={t.rewrite.outputPlaceholder}
                  />
                  {rewrittenScript && (
                    <div className="absolute bottom-4 right-4">
                      <span className="flex items-center gap-1 text-xs font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded border border-brand-100">
                        <Sparkles size={12} /> Generated by Gemini
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.features.title}</h2>
            <div className="w-16 h-1 bg-brand-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.features.items.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 mb-4">
                  {[<Zap key="1" />, <MessageSquare key="2" />, <Wand2 key="3" />, <Globe key="4" />][i]}
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">{t.faq.title}</h2>
          <div className="space-y-4">
            {t.faq.items.map((item, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-6 hover:border-brand-200 transition-colors bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-800 mb-2 flex items-start gap-3">
                  <span className="text-brand-500">Q.</span> {item.q}
                </h3>
                <p className="text-slate-600 pl-8 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-6 text-white">
            <Zap size={24} />
            <span className="font-bold text-2xl">ClipFlow</span>
          </div>
          <p className="text-sm opacity-70">
            {t.footer.design} · {t.footer.power}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
