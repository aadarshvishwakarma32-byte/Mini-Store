import { useState } from 'react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    // Keep it simple; no backend required.
    setSubmitted(true);
  };

  return (
    <main className="main">
      <section className="page">
        <h1 className="pageTitle">Contact Us</h1>

        <div className="contactGrid">
          <div className="contactCard">
            <h2 className="contactHeading">Send a message</h2>
            <form className="contactForm" onSubmit={onSubmit}>
              <label className="field">
                <span className="labelText">Name</span>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  type="text"
                  placeholder="Your name"
                />
              </label>

              <label className="field">
                <span className="labelText">Email</span>
                <input
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  placeholder="you@example.com"
                />
              </label>

              <label className="field">
                <span className="labelText">Message</span>
                <textarea
                  className="textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="Write your message..."
                />
              </label>

              <button type="submit" className="btn contactSubmit">
                Submit
              </button>

              {submitted && (
                <div className="status success" role="status">
                  Thanks! Your message has been recorded.
                </div>
              )}
            </form>
          </div>

          <div className="contactInfo">
            <div className="infoCard">
              <h2 className="contactHeading">Email</h2>
              <p className="infoText">support@ministore.com</p>
            </div>
            <div className="infoCard">
              <h2 className="contactHeading">Phone</h2>
              <p className="infoText">+1 (555) 123-4567</p>
            </div>
            <div className="infoCard">
              <h2 className="contactHeading">Address</h2>
              <p className="infoText">Mini Store, 123 Market Street, Your City</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;

