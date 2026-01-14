const Contact = () => {
  return (
    <section className="p-8 " id="contact">
      <div className="card md:w-2/3 mx-auto bg-secondary/40 p-8">
        <h1 className="card-title text-3xl font-bold mb-4">CONTACT US</h1>

        <form>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter Your Name"
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter Your Email"
              className="input input-bordered "
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Message</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-32"
              placeholder="Write Your Message...."
            />
          </div>
          <div className="card-actions">
            <button type="submit" className="btn btn-secondary mt-7">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
export default Contact;
