'use client'

/**
 * SuccessMessage — Fixed toast notification shown after form submissions.
 * @param {boolean} visible - Whether the message is currently visible
 */
export default function SuccessMessage({ visible }) {
  return (
    <div className={`success-message${visible ? ' visible' : ''}`} id="successMessage">
      <p>Thank you! We&apos;ll get back to you soon.</p>
    </div>
  )
}
