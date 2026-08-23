import Header from '../components/Header';
import About from '../components/About';
import Skills from '../components/Skills';

function Home() {
  const skills = [
    'React 19 & Hooks',
    'Node.js & Express',
    'MongoDB & Mongoose',
    'CORS Architecture',
    'RESTful API Integration',
    'State Synchronization',
    'Optimistic UI Updates',
    'CSS Custom Properties'
  ];

  return (
    <div className="home-page main-content">
      <Header name="Ary Patel" themeColor="#6366f1" />
      <About
        bio="This full-stack application demonstrates complete integration between a React single-page frontend (localhost:5173) and an Express/Mongoose backend (localhost:5000) backed by MongoDB."
        location="Advanced Web Technology Lab"
        study="Full Stack React + Express + MongoDB"
      />
      <Skills skillList={skills} />
    </div>
  );
}

export default Home;
