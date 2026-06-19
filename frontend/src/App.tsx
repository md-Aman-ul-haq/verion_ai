import { useState, useRef, useCallback, useEffect } from 'react'
import PipelineVisualizer from './components/PipelineVisualizer'

const API = 'http://localhost:8000'

// ── Types ──────────────────────────────────────────────────────────
interface SeoData {
  title?: string
  keywords?: string[]
  bullet_points?: string[]
  price?: string
  color?: string
  condition?: string
  weight?: string
  brand?: string
  material?: string
  dimensions?: string
  category?: string
  product_type?: string
  specs?: Record<string, string>
  error?: string
}

interface MarketingData {
  platform?: string
  whatsapp?: string
  instagram_caption?: string
  platform_description?: string
  call_to_action?: string
  error?: string
}

interface ResultData {
  sanitized_input?: string
  vision_analysis?: string
  seo?: SeoData
  marketing?: MarketingData
}

interface ApiResult {
  status: string
  data: ResultData
}

interface Connection {
  id: string
  platform: string
  shop_domain: string
  connected_at: string
}

type PublishState = 'idle' | 'uploading' | 'publishing' | 'success' | 'error'

// ── Platform config ────────────────────────────────────────────────
const PLATFORMS = [
  { id: 'shopify',   label: 'Shopify',   emoji: '🛍️', color: 'from-[#95bf47] to-[#5e8e3e]' },
  { id: 'amazon',    label: 'Amazon',    emoji: '📦', color: 'from-[#ff9900] to-[#232f3e]' },
  { id: 'instagram', label: 'Instagram', emoji: '📸', color: 'from-[#e1306c] to-[#833ab4]' },
]

// ── Copy button ────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button
      onClick={copy}
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all text-xs px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 font-medium"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// ── Main App ───────────────────────────────────────────────────────
function App() {
  const [rawInput, setRawInput]         = useState('')
  const [platform, setPlatform]         = useState('shopify')
  const [imageFiles, setImageFiles]     = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [pipelineStatus, setPipelineStatus] = useState({ step: 0, loading: false })
  const [results, setResults]           = useState<ApiResult | null>(null)
  const [error, setError]               = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Integration state ──
  const [connections, setConnections]     = useState<Connection[]>([])
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [shopifyDomain, setShopifyDomain] = useState('')
  const [shopifyToken, setShopifyToken]   = useState('')
  const [connectError, setConnectError]   = useState<string | null>(null)
  const [connectLoading, setConnectLoading] = useState(false)
  const [publishState, setPublishState]   = useState<PublishState>('idle')
  const [publishResult, setPublishResult] = useState<{admin_url?: string} | null>(null)
  const [publishError, setPublishError]   = useState<string | null>(null)
  const [publishVendor, setPublishVendor] = useState('Verion AI')
  const [publishPrice, setPublishPrice] = useState('0.00')
  const [publishQuantity, setPublishQuantity] = useState<number | ''>(1)

  // Load saved connections on mount
  useEffect(() => {
    fetch(`${API}/api/connections`)
      .then(r => r.json())
      .then(data => setConnections(data))
      .catch(() => {})
  }, [])

  // ── Image handling ──
  const addImages = useCallback((files: File[]) => {
    const valid = files.filter(f => f.type.startsWith('image/'))
    if (!valid.length) return
    setImageFiles(prev => [...prev, ...valid])
    valid.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () =>
        setImagePreviews(prev => [...prev, reader.result as string])
      reader.readAsDataURL(file)
    })
  }, [])

  const removeImage = (idx: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idx))
    setImagePreviews(prev => prev.filter((_, i) => i !== idx))
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    addImages(Array.from(e.dataTransfer.files))
  }, [addImages])

  // ── Generate ──
  const handleGenerate = async () => {
    if (!rawInput.trim()) return
    setPipelineStatus({ step: 1, loading: true })
    setResults(null)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('raw_description', rawInput)
      formData.append('platform', platform)
      imageFiles.forEach(f => formData.append('images', f))

      const response = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      setPipelineStatus({ step: 6, loading: false })
      setResults(data)
      if (data.data?.seo?.price) setPublishPrice(data.data.seo.price)
    } catch {
      setError('Failed to connect to the backend. Please ensure it is running.')
      setPipelineStatus({ step: 0, loading: false })
    }
  }

  const resultData = results?.data
  const activePlatform = PLATFORMS.find(p => p.id === platform)!

  return (
    <div className="min-h-screen p-6 lg:p-10">

      {/* ── Connect Store Modal ── */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl p-7 w-full max-w-md mx-4 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">🔗 Connect Shopify Store</h2>
              <button onClick={() => { setShowConnectModal(false); setConnectError(null) }} className="text-slate-500 hover:text-white text-xl">✕</button>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Create a <strong className="text-slate-200">Custom App</strong> in your Shopify Admin → Apps → Develop apps.<br/>
              Enable scopes: <code className="text-primary">write_products</code>, <code className="text-primary">read_products</code>, then copy the access token.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest mb-1 block">Shop Domain</label>
                <input
                  value={shopifyDomain} onChange={e => setShopifyDomain(e.target.value)}
                  placeholder="your-store.myshopify.com"
                  className="glass-input w-full p-3 rounded-xl text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest mb-1 block">Access Token</label>
                <input
                  type="password" value={shopifyToken} onChange={e => setShopifyToken(e.target.value)}
                  placeholder="shpat_…"
                  className="glass-input w-full p-3 rounded-xl text-white text-sm"
                />
              </div>
            </div>
            {connectError && <p className="text-red-400 text-xs">{connectError}</p>}
            <button
              disabled={connectLoading || !shopifyDomain || !shopifyToken}
              onClick={async () => {
                setConnectLoading(true); setConnectError(null)
                try {
                  const r = await fetch(`${API}/api/connections/shopify`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ shop_domain: shopifyDomain, access_token: shopifyToken }),
                  })
                  if (!r.ok) { const d = await r.json(); throw new Error(d.detail) }
                  const data = await r.json()
                  setConnections(prev => [...prev.filter(c => c.platform !== 'shopify'), data])
                  setShowConnectModal(false)
                } catch (e: any) { setConnectError(e.message) }
                finally { setConnectLoading(false) }
              }}
              className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {connectLoading ? 'Connecting…' : '🔌 Connect Store'}
            </button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary text-transparent bg-clip-text tracking-tight">
            Verion AI
          </h1>
          <p className="text-slate-400 mt-1 text-sm tracking-wide uppercase">
            Autonomous Privacy-First Multi-Agent Platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          {connections.some(c => c.platform === 'shopify') ? (
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 glass-panel rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#95bf47] animate-pulse"></span>
              <span className="text-sm text-slate-300">Shopify Connected</span>
            </div>
          ) : (
            <button onClick={() => setShowConnectModal(true)} className="hidden lg:flex items-center gap-2 px-4 py-2 glass-panel rounded-full hover:border-primary/50 transition-all">
              <span className="text-sm text-slate-400">🔌 Connect Store</span>
            </button>
          )}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 glass-panel rounded-full">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="text-sm text-slate-300">Agents Online</span>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left Panel: Input ── */}
        <section className="col-span-1 glass-panel rounded-2xl p-6 space-y-5">
          <h2 className="text-xl font-semibold text-white">Product Input</h2>

          {/* Platform Selector */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Select Platform</p>
            <div className="grid grid-cols-3 gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  id={`platform-${p.id}`}
                  onClick={() => setPlatform(p.id)}
                  title={p.label}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all duration-200 ${
                    platform === p.id
                      ? `bg-gradient-to-br ${p.color} border-transparent text-white shadow-lg scale-105`
                      : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{p.emoji}</span>
                  <span className="hidden sm:block truncate w-full text-center">{p.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Agents will tailor output specifically for <span className="text-slate-400">{activePlatform.emoji} {activePlatform.label}</span>
            </p>
          </div>

          {/* Multi-Image Upload */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Product Images <span className="normal-case text-slate-600">(optional, multiple)</span></p>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className="group cursor-pointer rounded-xl border-2 border-dashed border-slate-700 hover:border-primary/60 transition-all duration-300 p-4 text-center"
            >
              {imagePreviews.length === 0 ? (
                <div className="py-4 flex flex-col items-center gap-2 text-slate-500 group-hover:text-primary/70 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium">Drop images or click to upload</p>
                  <p className="text-xs text-slate-600">Multiple images supported</p>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative group/img aspect-square">
                        <img src={src} alt={`img-${i}`} className="w-full h-full object-cover rounded-lg" />
                        <button
                          onClick={e => { e.stopPropagation(); removeImage(i) }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {/* Add more slot */}
                    <div className="aspect-square flex items-center justify-center border-2 border-dashed border-slate-700 rounded-lg text-slate-600 hover:border-primary/50 hover:text-primary/60 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">{imagePreviews.length} image{imagePreviews.length > 1 ? 's' : ''} selected · click to add more</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => e.target.files && addImages(Array.from(e.target.files))}
            />
          </div>

          {/* Text Input */}
          <div className="relative">
            <textarea
              value={rawInput}
              onChange={e => setRawInput(e.target.value)}
              className="glass-input w-full p-4 rounded-xl text-white resize-none h-32 text-sm"
              placeholder={`Describe your product for ${activePlatform.label} (condition, price, specs…)`}
            />
            <span className="absolute bottom-3 right-3 text-xs text-slate-600">{rawInput.length} chars</span>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs">
              {error}
            </div>
          )}

          <button
            id="btn-generate"
            onClick={handleGenerate}
            disabled={pipelineStatus.loading || !rawInput.trim()}
            className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {pipelineStatus.loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Agents Working…
              </span>
            ) : `${activePlatform.emoji} Generate for ${activePlatform.label}`}
          </button>
        </section>

        {/* ── Right Panel ── */}
        <section className="col-span-1 lg:col-span-2 space-y-5">

          {pipelineStatus.step > 0 && (
            <div className="glass-panel rounded-2xl p-6">
              <PipelineVisualizer status={pipelineStatus} />
            </div>
          )}

          {resultData ? (
            <div className="space-y-5" id="results-dashboard">

              {/* Privacy */}
              {resultData.sanitized_input && (
                <div className="glass-panel rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🛡️</span>
                    <h3 className="font-semibold text-white">Privacy Agent Output</h3>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">PII Removed</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/50 rounded-lg p-4 font-mono">
                    {resultData.sanitized_input}
                  </p>
                </div>
              )}

              {/* Vision */}
              {resultData.vision_analysis && (
                <div className="glass-panel rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">👁️</span>
                    <h3 className="font-semibold text-white">Vision Agent Analysis</h3>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                      {imageFiles.length} Image{imageFiles.length > 1 ? 's' : ''} Processed
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{resultData.vision_analysis}</p>
                </div>
              )}

              {/* SEO */}
              {resultData.seo && !resultData.seo.error && (
                <div className="glass-panel rounded-2xl p-5 space-y-5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🚀</span>
                    <h3 className="font-semibold text-white">SEO Agent Output</h3>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Optimized</span>
                  </div>
                  {resultData.seo.title && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Listing Title</p>
                      <p className="text-xl font-bold text-white">{resultData.seo.title}</p>
                    </div>
                  )}
                  {resultData.seo.keywords && resultData.seo.keywords.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Target Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {resultData.seo.keywords.map((kw, i) => (
                          <span key={i} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {resultData.seo.bullet_points && resultData.seo.bullet_points.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Key Selling Points</p>
                      <ul className="space-y-2">
                        {resultData.seo.bullet_points.map((bp, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white">
                              {i + 1}
                            </span>
                            {bp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Extracted Attributes & Specs */}
                  {(() => {
                    const s = resultData.seo
                    const core = [
                      ['Price', s.price && s.price !== '0.00' ? `$${s.price}` : null],
                      ['Color', s.color], ['Condition', s.condition], ['Weight', s.weight],
                      ['Brand', s.brand], ['Material', s.material], ['Dimensions', s.dimensions],
                      ['Category', s.category], ['Type', s.product_type],
                    ].filter(([, v]) => v)
                    const specEntries = Object.entries(s.specs || {}).filter(([, v]) => v && String(v).toLowerCase() !== 'null')
                    if (core.length === 0 && specEntries.length === 0) return null
                    return (
                      <div className="mt-4 space-y-3">
                        {core.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {core.map(([label, val]) => (
                              <div key={label as string} className="bg-slate-900/60 rounded-lg px-3 py-2">
                                <p className="text-xs text-slate-500 uppercase tracking-widest">{label as string}</p>
                                <p className="text-sm text-white font-medium mt-0.5">{val as string}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {specEntries.length > 0 && (
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">📋 Full Specifications</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {specEntries.map(([k, v]) => (
                                <div key={k} className="bg-slate-900/40 border border-slate-700/40 rounded-lg px-3 py-2">
                                  <p className="text-xs text-slate-500 capitalize">{k.replace(/_/g, ' ')}</p>
                                  <p className="text-xs text-slate-200 font-medium mt-0.5">{v as string}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              )}
              {resultData.seo?.error && (
                <div className="glass-panel rounded-2xl p-5">
                  <p className="text-red-400 text-sm">⚠️ SEO Agent Error: {resultData.seo.error}</p>
                </div>
              )}

              {/* Marketing */}
              {resultData.marketing && !resultData.marketing.error && (
                <div className="glass-panel rounded-2xl p-5 space-y-5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📣</span>
                    <h3 className="font-semibold text-white">Marketing Agent Output</h3>
                    <span className={`ml-auto text-xs px-2.5 py-0.5 rounded-full font-medium bg-gradient-to-r ${activePlatform.color} text-white`}>
                      {activePlatform.emoji} {resultData.marketing.platform ?? activePlatform.label}
                    </span>
                  </div>

                  {resultData.marketing.whatsapp && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">WhatsApp Message</p>
                      <div className="relative group">
                        <div className="bg-[#075e54]/10 border border-[#25d366]/20 rounded-xl p-4 text-sm text-slate-200 leading-relaxed">
                          {resultData.marketing.whatsapp}
                        </div>
                        <CopyButton text={resultData.marketing.whatsapp} />
                      </div>
                    </div>
                  )}

                  {resultData.marketing.instagram_caption && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Instagram Caption</p>
                      <div className="relative group">
                        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-pink-500/20 rounded-xl p-4 text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                          {resultData.marketing.instagram_caption}
                        </div>
                        <CopyButton text={resultData.marketing.instagram_caption} />
                      </div>
                    </div>
                  )}

                  {resultData.marketing.platform_description && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">
                        {activePlatform.label} Listing Description
                      </p>
                      <div className="relative group">
                        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-sm text-slate-200 leading-relaxed">
                          {resultData.marketing.platform_description}
                        </div>
                        <CopyButton text={resultData.marketing.platform_description} />
                      </div>
                    </div>
                  )}

                  {resultData.marketing.call_to_action && (
                    <div className={`flex items-center justify-between bg-gradient-to-r ${activePlatform.color} bg-opacity-10 rounded-xl px-5 py-3`}>
                      <p className="text-sm font-semibold text-white">"{resultData.marketing.call_to_action}"</p>
                      <span className="text-xs text-white/60 ml-2 flex-shrink-0">CTA</span>
                    </div>
                  )}
                </div>
              )}

              {resultData.marketing?.error && (
                <div className="glass-panel rounded-2xl p-5">
                  <p className="text-red-400 text-sm">⚠️ Marketing Agent Error: {resultData.marketing.error}</p>
                </div>
              )}

              {/* ── Publish to Platform ── */}
              {platform === 'shopify' && (
                <div className="glass-panel rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🛍️</span>
                    <h3 className="font-semibold text-white">Publish to Shopify</h3>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[#95bf47]/10 text-[#95bf47] border border-[#95bf47]/20">Draft Mode</span>
                  </div>
                  <p className="text-slate-400 text-xs">Your listing will be saved as a <strong className="text-slate-200">draft</strong> in your Shopify admin so you can review before going live.</p>

                  {!connections.some(c => c.platform === 'shopify') ? (
                    <button onClick={() => setShowConnectModal(true)} className="w-full py-3 px-4 rounded-xl border border-dashed border-slate-600 text-slate-400 hover:border-[#95bf47]/50 hover:text-[#95bf47] transition-all text-sm">
                      🔌 Connect your Shopify store first
                    </button>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-slate-500 uppercase tracking-widest mb-1 block">Price</label>
                            <input value={publishPrice} onChange={e => setPublishPrice(e.target.value)} className="glass-input w-full p-2.5 rounded-lg text-white text-sm" placeholder="0.00" />
                          </div>
                          <div>
                            <label className="text-xs text-slate-500 uppercase tracking-widest mb-1 block">Units (Qty)</label>
                            <input type="number" min="0" value={publishQuantity} onChange={e => setPublishQuantity(e.target.value ? parseInt(e.target.value) : '')} className="glass-input w-full p-2.5 rounded-lg text-white text-sm" placeholder="1" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 uppercase tracking-widest mb-1 block">Vendor Name</label>
                          <input value={publishVendor} onChange={e => setPublishVendor(e.target.value)} className="glass-input w-full p-2.5 rounded-lg text-white text-sm" placeholder="Store Name" />
                        </div>
                      </div>

                      {publishState === 'success' && publishResult ? (
                        <div className="bg-[#95bf47]/10 border border-[#95bf47]/30 rounded-xl p-4 space-y-2">
                          <p className="text-[#95bf47] font-semibold text-sm">✅ Published as Draft!</p>
                          <a href={publishResult.admin_url} target="_blank" rel="noreferrer" className="text-xs text-slate-300 underline underline-offset-2 hover:text-white">View in Shopify Admin →</a>
                        </div>
                      ) : (
                        <>
                          {publishError && <p className="text-red-400 text-xs">{publishError}</p>}
                          <button
                            disabled={publishState !== 'idle'}
                            onClick={async () => {
                              setPublishError(null)
                              const seoTitle = resultData?.seo?.title || 'New Product'
                              const desc = resultData?.marketing?.platform_description || resultData?.marketing?.whatsapp || ''
                              const tags = resultData?.seo?.keywords || []
                              let imageUrls: string[] = []
                              if (imageFiles.length > 0) {
                                setPublishState('uploading')
                                try {
                                  const fd = new FormData()
                                  imageFiles.forEach(f => fd.append('images', f))
                                  const r = await fetch(`${API}/api/upload-images`, { method: 'POST', body: fd })
                                  if (!r.ok) throw new Error('Image upload failed')
                                  imageUrls = (await r.json()).image_urls
                                } catch (e: any) { setPublishError(e.message); setPublishState('idle'); return }
                              }
                              setPublishState('publishing')
                              const seo = resultData?.seo || {}
                              try {
                                const r = await fetch(`${API}/api/publish`, {
                                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    platform: 'shopify',
                                    title: seoTitle,
                                    description: desc,
                                    tags,
                                    price: publishPrice || '0.00',
                                    image_urls: imageUrls,
                                    vendor: publishVendor || 'Verion AI',
                                    quantity: publishQuantity !== '' ? publishQuantity : undefined,
                                    // ── Metafields ──
                                    color: seo.color || null,
                                    condition: seo.condition || null,
                                    weight: seo.weight || null,
                                    brand: seo.brand || null,
                                    material: seo.material || null,
                                    dimensions: seo.dimensions || null,
                                    category: seo.category || null,
                                    product_type: seo.product_type || '',
                                    specs: seo.specs || {},
                                  }),
                                })
                                if (!r.ok) { const d = await r.json(); throw new Error(d.detail) }
                                const data = await r.json()
                                setPublishResult(data.result)
                                setPublishState('success')
                              } catch (e: any) { setPublishError(e.message); setPublishState('idle') }
                            }}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {publishState === 'uploading' ? '📤 Uploading Images…'
                              : publishState === 'publishing' ? '🚀 Publishing…'
                              : '🛍️ Publish to Shopify'}
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}

            </div>
          ) : pipelineStatus.step === 0 && (
            <div className="glass-panel rounded-2xl p-10 flex flex-col items-center justify-center gap-4 text-center min-h-[300px]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center text-3xl">
                ✦
              </div>
              <div>
                <p className="text-slate-300 font-medium">Pipeline Ready</p>
                <p className="text-slate-600 text-sm mt-1">Select a platform, add images, enter a description and hit Generate.</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
