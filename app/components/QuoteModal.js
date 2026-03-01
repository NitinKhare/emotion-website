'use client'

import { useEffect, useRef, useState } from 'react'

const WEB3FORMS_KEY = 'd7b43c78-5b65-4e5e-a8ff-67b77f4331f7'

const BUDGET_OPTIONS = [
  { value: 'below-1l',  label: 'Below ₹1,00,000',          tier: 'STARTER' },
  { value: '1l-5l',     label: '₹1,00,000 – ₹5,00,000',   tier: 'STANDARD' },
  { value: '5l-10l',    label: '₹5,00,000 – ₹10,00,000',  tier: 'PREMIUM' },
  { value: '10l-25l',   label: '₹10,00,000 – ₹25,00,000', tier: 'ELITE' },
  { value: 'above-25l', label: '₹25,00,000+',              tier: 'FLAGSHIP' },
]

const TIMELINE_OPTIONS = [
  { value: 'urgent',    label: 'Within 1 Week',  tier: 'URGENT' },
  { value: '2-weeks',   label: '2 Weeks',         tier: 'EXPRESS' },
  { value: '1-month',   label: '1 Month',         tier: 'STANDARD' },
  { value: '2-months',  label: '2 Months',        tier: 'RELAXED' },
  { value: 'flexible',  label: 'Flexible',        tier: 'OPEN' },
]

/**
 * QuoteModal — Full-screen modal with detailed quote request form.
 * @param {boolean} isOpen   - Whether the modal is visible
 * @param {Function} onClose - Callback to close the modal
 * @param {Function} onSuccess - Callback fired after successful form submission
 */
export default function QuoteModal({ isOpen, onClose, onSuccess }) {
  const modalRef          = useRef(null)
  const dropdownRef       = useRef(null)
  const timelineDropdownRef = useRef(null)
  const [budgetOpen,    setBudgetOpen]    = useState(false)
  const [budgetValue,   setBudgetValue]   = useState('')
  const [timelineOpen,  setTimelineOpen]  = useState(false)
  const [timelineValue, setTimelineValue] = useState('')
  const [submitting,    setSubmitting]    = useState(false)
  const [error,         setError]         = useState('')

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setBudgetOpen(false)
      }
      if (timelineDropdownRef.current && !timelineDropdownRef.current.contains(e.target)) {
        setTimelineOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close on outside click
  useEffect(() => {
    const modal = modalRef.current
    if (!modal) return

    function handleOutsideClick(e) {
      if (e.target === modal) {
        onClose()
      }
    }
    modal.addEventListener('click', handleOutsideClick)
    return () => modal.removeEventListener('click', handleOutsideClick)
  }, [onClose])

  async function handleQuoteSubmit(event) {
    event.preventDefault()
    const services = [...event.target.querySelectorAll('input[name="services"]:checked')].map(el => el.value)
    if (services.length === 0) {
      alert('Please select at least one service.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const formData = new FormData(event.target)
      // Formspree doesn't handle multi-value fields by default, join them
      formData.delete('services')
      formData.append('services', services.join(', '))

      formData.append('access_key', WEB3FORMS_KEY)
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error('Submission failed')
      event.target.reset()
      setBudgetValue('')
      setTimelineValue('')
      onClose()
      onSuccess()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className={`quote-modal${isOpen ? ' active' : ''}`}
      id="quoteModal"
      ref={modalRef}
    >
      <div className="quote-form-container">
        <div className="close-modal" onClick={onClose}>×</div>
        <h2>Request a Free Quote</h2>
        <p>Tell us about your project and we&apos;ll get back to you within 24 hours</p>
        <form onSubmit={handleQuoteSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quote-name">Full Name *</label>
              <input type="text" id="quote-name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="quote-company">Company Name</label>
              <input type="text" id="quote-company" name="company" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quote-email">Email *</label>
              <input type="email" id="quote-email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="quote-phone">Phone *</label>
              <input type="tel" id="quote-phone" name="phone" required />
            </div>
          </div>
          <div className="form-group">
            <label>Services Required *</label>
            <div className="service-checkboxes">
              <div className="service-checkbox">
                <input type="checkbox" id="service-video" name="services" value="video-production" />
                <label htmlFor="service-video">Video Production</label>
              </div>
              <div className="service-checkbox">
                <input type="checkbox" id="service-voice" name="services" value="voice-over" />
                <label htmlFor="service-voice">Voice Over/Dubbing</label>
              </div>
              <div className="service-checkbox">
                <input type="checkbox" id="service-animation" name="services" value="animation" />
                <label htmlFor="service-animation">Animation</label>
              </div>
              <div className="service-checkbox">
                <input type="checkbox" id="service-music" name="services" value="music" />
                <label htmlFor="service-music">Music/Sound Design</label>
              </div>
              <div className="service-checkbox">
                <input type="checkbox" id="service-concept" name="services" value="conceptualization" />
                <label htmlFor="service-concept">Creative Concept</label>
              </div>
              <div className="service-checkbox">
                <input type="checkbox" id="service-post" name="services" value="post-production" />
                <label htmlFor="service-post">Post-Production</label>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Investment Range</label>
            {/* Hidden input carries the value for FormData */}
            <input type="hidden" name="budget" value={budgetValue} />
            <div
              className={`budget-select${budgetOpen ? ' open' : ''}`}
              ref={dropdownRef}
            >
              {/* Trigger */}
              <button
                type="button"
                className="budget-trigger"
                onClick={() => setBudgetOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={budgetOpen}
              >
                <span className={`budget-trigger-text${!budgetValue ? ' placeholder' : ''}`}>
                  {budgetValue
                    ? BUDGET_OPTIONS.find(o => o.value === budgetValue)?.label
                    : 'Select investment range'}
                </span>
                <span className="budget-chevron">›</span>
              </button>

              {/* Panel */}
              {budgetOpen && (
                <ul className="budget-panel" role="listbox">
                  {BUDGET_OPTIONS.map(opt => (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={budgetValue === opt.value}
                      className={`budget-option${budgetValue === opt.value ? ' selected' : ''}`}
                      onClick={() => { setBudgetValue(opt.value); setBudgetOpen(false) }}
                    >
                      <span className="budget-tier">{opt.tier}</span>
                      <span className="budget-amount">{opt.label}</span>
                      {budgetValue === opt.value && <span className="budget-check">✓</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="form-group">
            <label>Project Timeline</label>
            {/* Hidden input carries the value for FormData */}
            <input type="hidden" name="timeline" value={timelineValue} />
            <div
              className={`budget-select${timelineOpen ? ' open' : ''}`}
              ref={timelineDropdownRef}
            >
              {/* Trigger */}
              <button
                type="button"
                className="budget-trigger"
                onClick={() => setTimelineOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={timelineOpen}
              >
                <span className={`budget-trigger-text${!timelineValue ? ' placeholder' : ''}`}>
                  {timelineValue
                    ? TIMELINE_OPTIONS.find(o => o.value === timelineValue)?.label
                    : 'Select project timeline'}
                </span>
                <span className="budget-chevron">›</span>
              </button>

              {/* Panel */}
              {timelineOpen && (
                <ul className="budget-panel" role="listbox">
                  {TIMELINE_OPTIONS.map(opt => (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={timelineValue === opt.value}
                      className={`budget-option${timelineValue === opt.value ? ' selected' : ''}`}
                      onClick={() => { setTimelineValue(opt.value); setTimelineOpen(false) }}
                    >
                      <span className="budget-tier">{opt.tier}</span>
                      <span className="budget-amount">{opt.label}</span>
                      {timelineValue === opt.value && <span className="budget-check">✓</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="quote-details">Project Details *</label>
            <textarea id="quote-details" name="details" rows={5} required placeholder="Tell us about your project, goals, and any specific requirements..."></textarea>
          </div>
          <div className="checkbox-group">
            <input type="checkbox" id="quote-newsletter" name="newsletter" />
            <label htmlFor="quote-newsletter">Subscribe to our newsletter for creative tips and updates</label>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Quote Request'}
          </button>
        </form>
      </div>
    </div>
  )
}
