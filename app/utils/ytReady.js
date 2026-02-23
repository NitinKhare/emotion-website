/**
 * onYTReady — safely registers a YouTube IFrame API ready callback.
 *
 * Multiple components can call this; each callback is queued and all run
 * when the API loads. Avoids the global-overwrite race between Hero and
 * BroadcastMonitor.
 */
export function onYTReady(callback) {
  if (window.YT && window.YT.Player) {
    callback()
    return
  }

  // Chain onto any previously registered callback instead of overwriting it
  const prev = window.onYouTubeIframeAPIReady
  window.onYouTubeIframeAPIReady = function () {
    if (typeof prev === 'function') prev()
    callback()
  }

  // Inject the API script only once
  if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
    const tag = document.createElement('script')
    tag.src   = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  }
}
