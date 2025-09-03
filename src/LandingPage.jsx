import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./NavBar"


import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Card } from "./components/ui/card"

export default function LandingPage() {

    const [videoUrl, setVideoUrl] = useState("")
    const [error, setError] = useState("")
  const navigate = useNavigate()

  const isValidYouTubeUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
    return regex.test(url)
  }

  const handleEditClick = () => {
    if (!isValidYouTubeUrl(videoUrl)) {
      setError("Please enter a valid YouTube URL.")
      return
    }
    setError("")
    navigate("/edit", { state: { videoUrl } })
  }

  return (
     <div className="min-h-screen flex flex-col">
    <Navbar />
    {/* Main Section */}
      <main className="flex flex-1 flex-col justify-center items-center">
        <Card className="p-6 flex items-center shadow-lg">
          
            <Input
              type="text"
              placeholder="Paste YouTube URL here"
              className="w-80 sm:w-96"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <Button onClick={handleEditClick}>Edit</Button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          
        </Card>
      </main>
  </div>
  )
}