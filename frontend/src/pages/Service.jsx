const Service = () => {
  const services = [
    { title: 'Fast Delivery', desc: 'Quick shipping so you get your items sooner.' },
    { title: 'Secure Payment', desc: 'Protected transactions with trusted payment methods.' },
    { title: '24/7 Support', desc: 'We’re here to help anytime, day or night.' },
    { title: 'Easy Returns', desc: 'Simple return process if something isn’t right.' },
  ];

  return (
    <main className="main">
      <section className="page">
        <h1 className="pageTitle">Our Services</h1>
        <div className="serviceGrid">
          {services.map((s) => (
            <div key={s.title} className="serviceCard">
              <h2 className="serviceHeading">{s.title}</h2>
              <p className="serviceText">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Service;

