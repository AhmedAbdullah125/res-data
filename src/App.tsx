import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import GetStarted from './pages/GetStarted'
import Results from './pages/Results'
import About from './pages/About'
import Blogs from './pages/Blogs'
import BlogDetails from './pages/BlogDetails'
import PagePlaceholder from './pages/PagePlaceholder'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="get-started" element={<GetStarted />} />
        <Route
          path="services"
          element={<PagePlaceholder title="Services" subtitle="What RES-DATA does for your pipeline." />}
        />
        <Route
          path="how-it-works"
          element={<PagePlaceholder title="How It Works" subtitle="From raw records to actionable leads." />}
        />
        <Route path="results" element={<Results />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:slug" element={<BlogDetails />} />
        <Route path="about" element={<About />} />
        <Route
          path="faq"
          element={<PagePlaceholder title="FAQ" subtitle="Answers to common questions." />}
        />
        <Route
          path="contact"
          element={<PagePlaceholder title="Talk to Us" subtitle="Tell us about your market and lead problems." />}
        />
        <Route
          path="*"
          element={<PagePlaceholder title="Page not found" subtitle="The page you're looking for doesn't exist." />}
        />
      </Route>
    </Routes>
  )
}
