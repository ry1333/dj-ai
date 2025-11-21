import { useEffect, useState } from 'react'

type Props = {
  audioContext?: AudioContext
  sourceNode?: AudioNode
  label?: string
  orientation?: 'horizontal' | 'vertical'
  height?: number
  width?: number
}

export default function VUMeter({
  audioContext,
  sourceNode,
  label,
  orientation = 'vertical',
  height = 120,
  width = 200
}: Props) {
  const [peakLevel, setPeakLevel] = useState(0)
  const [rmsLevel, setRmsLevel] = useState(0)
  const [peakHold, setPeakHold] = useState(0)
  const [peakHoldTime, setPeakHoldTime] = useState(0)

  useEffect(() => {
    if (!audioContext || !sourceNode) return

    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 2048
    analyser.smoothingTimeConstant = 0.8

    try {
      sourceNode.connect(analyser)
    } catch (e) {
      // Already connected or invalid connection
      console.warn('VU Meter: Could not connect analyser', e)
    }

    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    let animationId: number

    const updateLevels = () => {
      analyser.getByteTimeDomainData(dataArray)

      // Calculate peak level
      let peak = 0
      let sumSquares = 0
      for (let i = 0; i < dataArray.length; i++) {
        const normalized = (dataArray[i] - 128) / 128
        const abs = Math.abs(normalized)
        if (abs > peak) peak = abs
        sumSquares += normalized * normalized
      }

      // Calculate RMS (Root Mean Square) level
      const rms = Math.sqrt(sumSquares / dataArray.length)

      // Convert to dB scale (-60dB to 0dB)
      const peakDb = peak > 0 ? 20 * Math.log10(peak) : -60
      const rmsDb = rms > 0 ? 20 * Math.log10(rms) : -60

      // Normalize to 0-1 range for display (-60dB = 0, 0dB = 1)
      const peakNormalized = Math.max(0, Math.min(1, (peakDb + 60) / 60))
      const rmsNormalized = Math.max(0, Math.min(1, (rmsDb + 60) / 60))

      setPeakLevel(peakNormalized)
      setRmsLevel(rmsNormalized)

      // Peak hold logic (holds for 3 seconds)
      const now = Date.now()
      if (peakNormalized > peakHold || now - peakHoldTime > 3000) {
        setPeakHold(peakNormalized)
        setPeakHoldTime(now)
      }

      animationId = requestAnimationFrame(updateLevels)
    }

    updateLevels()

    return () => {
      cancelAnimationFrame(animationId)
      try {
        analyser.disconnect()
      } catch (e) {
        // Already disconnected
      }
    }
  }, [audioContext, sourceNode, peakHold, peakHoldTime])

  // Convert level (0-1) to dB for display
  const levelToDb = (level: number) => {
    if (level === 0) return -60
    return Math.round(20 * Math.log10(level) - 60)
  }

  // Get color based on level (green -> yellow -> red)
  const getSegmentColor = (position: number) => {
    if (position > 0.9) return 'bg-red-500' // -6dB to 0dB
    if (position > 0.75) return 'bg-yellow-500' // -12dB to -6dB
    return 'bg-green-500' // -60dB to -12dB
  }

  const segments = 20 // Number of LED segments

  if (orientation === 'vertical') {
    return (
      <div className="flex flex-col items-center gap-2">
        {label && (
          <div className="text-[9px] text-muted uppercase tracking-wider font-semibold">
            {label}
          </div>
        )}

        <div className="relative" style={{ width: '24px', height: `${height}px` }}>
          {/* LED Segments */}
          <div className="absolute inset-0 flex flex-col-reverse gap-[2px]">
            {Array.from({ length: segments }).map((_, i) => {
              const segmentPosition = (i + 1) / segments
              const isRmsActive = rmsLevel >= segmentPosition
              const isPeakActive = peakLevel >= segmentPosition
              const isPeakHold = Math.abs(peakHold - segmentPosition) < 0.05

              return (
                <div
                  key={i}
                  className={`flex-1 rounded-sm transition-all duration-75 ${
                    isRmsActive || isPeakActive
                      ? `${getSegmentColor(segmentPosition)} shadow-[0_0_4px_currentColor]`
                      : isPeakHold
                      ? 'bg-white shadow-[0_0_4px_white]'
                      : 'bg-zinc-800/50'
                  }`}
                  style={{
                    opacity: isRmsActive ? 0.9 : isPeakActive ? 0.6 : isPeakHold ? 1 : 0.3
                  }}
                />
              )
            })}
          </div>

          {/* dB Scale markers */}
          <div className="absolute -right-6 inset-y-0 flex flex-col justify-between text-[8px] text-muted font-mono">
            <span>0</span>
            <span className="opacity-60">-12</span>
            <span className="opacity-60">-24</span>
            <span className="opacity-60">-36</span>
            <span>-60</span>
          </div>
        </div>

        {/* Current level display */}
        <div className="text-[10px] font-mono font-bold text-cyan">
          {levelToDb(rmsLevel)} dB
        </div>
      </div>
    )
  }

  // Horizontal orientation
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="text-[9px] text-muted uppercase tracking-wider font-semibold">
          {label}
        </div>
      )}

      <div className="relative" style={{ width: `${width}px`, height: '24px' }}>
        {/* LED Segments */}
        <div className="absolute inset-0 flex gap-[2px]">
          {Array.from({ length: segments }).map((_, i) => {
            const segmentPosition = (i + 1) / segments
            const isRmsActive = rmsLevel >= segmentPosition
            const isPeakActive = peakLevel >= segmentPosition
            const isPeakHold = Math.abs(peakHold - segmentPosition) < 0.05

            return (
              <div
                key={i}
                className={`flex-1 rounded-sm transition-all duration-75 ${
                  isRmsActive || isPeakActive
                    ? `${getSegmentColor(segmentPosition)} shadow-[0_0_4px_currentColor]`
                    : isPeakHold
                    ? 'bg-white shadow-[0_0_4px_white]'
                    : 'bg-zinc-800/50'
                }`}
                style={{
                  opacity: isRmsActive ? 0.9 : isPeakActive ? 0.6 : isPeakHold ? 1 : 0.3
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Current level display */}
      <div className="text-[10px] font-mono font-bold text-cyan text-center">
        {levelToDb(rmsLevel)} dB
      </div>
    </div>
  )
}
