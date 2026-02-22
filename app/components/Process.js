'use client'

/**
 * Process — Alternating timeline showing the 5-step creative workflow.
 */
export default function Process() {
  return (
    <section className="process" id="process">
      <div className="section-header animate-on-scroll">
        <h2>Our Creative Process</h2>
        <p>A streamlined approach that transforms your vision into compelling content</p>
      </div>
      <div className="process-timeline">
        <div className="timeline-line"></div>
        <div className="process-step animate-on-scroll">
          <div className="step-content">
            <h3>Brief &amp; Strategy</h3>
            <p>We start by understanding your objectives, target audience, and brand message to create a clear creative brief.</p>
          </div>
          <div className="step-number">1</div>
          <div className="step-content"></div>
        </div>
        <div className="process-step animate-on-scroll">
          <div className="step-content"></div>
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Conceptualization</h3>
            <p>Our creative team develops compelling concepts that align with your brand and resonate with your audience.</p>
          </div>
        </div>
        <div className="process-step animate-on-scroll">
          <div className="step-content">
            <h3>Production</h3>
            <p>Professional execution with top-tier equipment, talented artists, and meticulous attention to detail.</p>
          </div>
          <div className="step-number">3</div>
          <div className="step-content"></div>
        </div>
        <div className="process-step animate-on-scroll">
          <div className="step-content"></div>
          <div className="step-number">4</div>
          <div className="step-content">
            <h3>Post-Production</h3>
            <p>Expert editing, sound design, and finishing touches that elevate your content to professional standards.</p>
          </div>
        </div>
        <div className="process-step animate-on-scroll">
          <div className="step-content">
            <h3>Delivery &amp; Support</h3>
            <p>Final delivery in your preferred formats with ongoing support to ensure maximum impact.</p>
          </div>
          <div className="step-number">5</div>
          <div className="step-content"></div>
        </div>
      </div>
    </section>
  )
}
