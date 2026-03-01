'use client'

/**
 * Team — Team member cards with photos and bios.
 */
export default function Team() {
  return (
    <section className="team" id="team">
      <div className="section-header animate-on-scroll">
        <h2>Meet Our Creative Team</h2>
        <p>Passionate professionals dedicated to bringing your vision to life</p>
      </div>
      <div className="team-grid">
        <div className="team-member animate-on-scroll">
          <div className="member-photo">
            <img src="https://emotionproduction.in/wp-content/uploads/2019/12/0.jpg" alt="Homiyar Sachinwala" />
          </div>
          <h3>Homiyar Sachinwala</h3>
          <p>26 years of experience in advertising, sales, and client servicing. Expert in creative direction, script writing, and voice-over artistry.</p>
        </div>
        <div className="team-member animate-on-scroll">
          <div className="member-photo">
            <img src="https://emotionproduction.in/wp-content/uploads/2024/12/sakshi-959x1024.jpg" alt="Sakshi Shreya" />
          </div>
          <h3>Sakshi Shreya</h3>
          <p>Indian playback singer and creative producer working across advertising, voice-overs, and dubbing. She manages talent, coordinates crews, and oversees projects from pre-production to post-production, ensuring smooth execution and high-quality results.</p>
        </div>
      </div>
    </section>
  )
}
