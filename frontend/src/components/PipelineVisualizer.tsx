interface Step {
  id: number
  name: string
  icon: string
}

const STEPS: Step[] = [
  { id: 1, name: "Input Processing",   icon: "📝" },
  { id: 2, name: "Privacy Protection", icon: "🛡️" },
  { id: 3, name: "Vision Analysis",    icon: "👁️" },
  { id: 4, name: "SEO Optimization",   icon: "🚀" },
  { id: 5, name: "Marketing Content",  icon: "📣" },
  { id: 6, name: "Validation & Quality", icon: "✅" },
]

export default function PipelineVisualizer({ status }: { status: { step: number; loading: boolean } }) {
  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Agent Pipeline</h3>
      <div className="space-y-2">
        {STEPS.map((step) => {
          const isDone    = status.step > step.id
          const isActive  = status.step === step.id && status.loading

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${
                isDone
                  ? 'bg-secondary/5 border-secondary/25 text-white'
                  : isActive
                  ? 'bg-primary/10 border-primary/40 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                  : 'bg-slate-900/30 border-slate-800/50 text-slate-600'
              }`}
            >
              {/* Status indicator */}
              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                isDone
                  ? 'bg-secondary text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                  : isActive
                  ? 'bg-primary text-white shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                  : 'bg-slate-800 text-slate-600'
              }`}>
                {isDone ? '✓' : step.id}
              </div>

              {/* Icon + name */}
              <span className="text-base">{step.icon}</span>
              <span className="font-medium text-sm flex-1">{step.name}</span>

              {/* Status label */}
              {isDone && (
                <span className="text-xs text-secondary font-medium">Done</span>
              )}
              {isActive && (
                <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                  Running
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
