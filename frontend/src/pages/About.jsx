const About = () => {
  return (
    <main className="main">
      <section className="page">
        <h1 className="pageTitle">About Mini Store</h1>
        <p className="pageText">
          Welcome to Mini Store—your one-stop shop for everyday essentials. We focus on quality,
          convenience, and trust in every order.
        </p>

        <div className="aboutGrid">
          <div className="aboutCard">
            <h2 className="aboutHeading">Mission</h2>
            <p className="aboutText">To make shopping simple, fast, and reliable for everyone.</p>
          </div>

          <div className="aboutCard">
            <h2 className="aboutHeading">Vision</h2>
            <p className="aboutText">To become the go-to mini marketplace with exceptional customer care.</p>
          </div>

          <div className="aboutCard">
            <h2 className="aboutHeading">Features</h2>
            <ul className="aboutList">
              <li>Quality products curated for everyday use</li>
              <li>Responsive support when you need it</li>
              <li>Simple returns for peace of mind</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;

