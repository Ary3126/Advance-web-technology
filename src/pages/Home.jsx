import Header from '../components/Header'
import About from '../components/About'
import Skills from '../components/Skills'

function Home() {
  const skills = [
    'HTML5 & CSS3',
    'JavaScript (ES6+)',
    'React.js',
    'React Router v6',
    'Vite',
    'State Management (useState)',
    'Responsive Web Design',
    'Git & GitHub'
  ]

  return (
    <div className="home-page main-content">
      <Header name="Ary Patel" themeColor="#6366f1" />
      <About
        bio="I am a second-year Computer Science student passionate about web technologies, reactive user interfaces, and building practical single-page web applications with modern tools."
        location="Mumbai, India"
        study="Frontend Development & React"
      />
      <Skills skillList={skills} />
    </div>
  )
}

export default Home
