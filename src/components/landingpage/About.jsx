import img1 from "../../assets/about-img1.jpeg";
import img2 from "../../assets/about-img2.jpg";

const About = () => {
  return (
    <section className="md:mt-20 p-8 " id="about">
      <div className="w-11/12 h-1/4 flex items-center box-border p-4 gap-16 mx-auto">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2 ">About Us</h1>
          <p className="text-justify">
            RESHELF IS A COMMUNITY-DRIVEN PLATFORM DEDICATED TO GIVING BOOKS A
            SECOND LIFE. WHETHER YOU'RE A STUDENT, A CASUAL READER, OR A LOCAL
            BOOKSTORE OWNER, RESHELF MAKES IT EASY TO SHARE, DISCOVER, AND
            ACCESS SECOND-HAND BOOKS NEAR YOU. WE BELIEVE EVERY BOOK DESERVES
            MORE THAN ONE READER - AND EVERY READER DESERVES AFFORDABLE ACCESS
            TO STORIES, KNOWLEDGE, AND LEARNING.
          </p>
        </div>
        <img
          src={img1}
          alt="image of girl reading a book"
          className="flex-1 object-cover h-full rounded-lg w-40 max-md:hidden"
        />
      </div>

      <div className="w-11/12 h-[350px] flex items-center box-border p-4 gap-16 mx-auto md:mt-16">
        <img
          src={img2}
          alt="image of girl reading a book"
          className="flex-1 object-cover h-full rounded-lg w-40 max-md:hidden"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2 ">WHAT WE OFFER</h1>
          <ul className="list-disc text-justify">
            <li> A PLACE TO LIST AND SHARE YOUR USED BOOKS</li>
            <li> SHOP PROFILES TO SHOWCASE BOOKSTORE COLLECTIONS</li>
            <li> POWERFUL SEARCH TO HELP YOU FIND THE BOOKS YOU NEED</li>
            <li> A SOCIAL LAYER TO CONNECT WITH READERS AND SHOPKEEPERS</li>
            <li> A SUSTAINABLE WAY TO PROMOTE READING AND REUSING</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
export default About;
