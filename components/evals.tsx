"use client"

import { useState, useEffect } from "react"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Define the type for task items
type Task = {
  text: string
  importance: "low" | "medium" | "high"
  completed: boolean
}

export function Evals() {
  const [isRunning, setIsRunning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(25 * 60)
  const [timerType, setTimerType] = useState("pomodoro")
  const [tasks, setTasks] = useState<Task[]>([]) // Specify the type for tasks
  const [tasksCompleted, setTasksCompleted] = useState(0)
  const [userName, setUserName] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [newTask, setNewTask] = useState("")
  const [newTaskImportance, setNewTaskImportance] = useState<"low" | "medium" | "high">("low") // Specify the type for task importance

  useEffect(() => {
    let interval: number | undefined // Explicitly type the interval variable

    if (isRunning) {
      interval = window.setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1)
      }, 1000)
    }

    return () => {
      if (interval !== undefined) {
        window.clearInterval(interval)
      }
    }
  }, [isRunning])

  useEffect(() => {
    if (timeRemaining === 0) {
      setIsRunning(false)
      if (timerType === "pomodoro") {
        setTimerType("short-break")
        setTimeRemaining(5 * 60)
      } else if (timerType === "short-break") {
        setTimerType("pomodoro")
        setTimeRemaining(25 * 60)
      } else if (timerType === "long-break") {
        setTimerType("pomodoro")
        setTimeRemaining(25 * 60)
      }
      setTasksCompleted((prevCount) => prevCount + 1)
    }
  }, [timeRemaining, timerType])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    if (timerType === "pomodoro") {
      setTimeRemaining(25 * 60)
    } else if (timerType === "short-break") {
      setTimeRemaining(5 * 60)
    } else if (timerType === "long-break") {
      setTimeRemaining(15 * 60)
    }
  }

  const handleTimerTypeChange = (type: "pomodoro" | "short-break" | "long-break") => {
    setTimerType(type)
    setTimeRemaining(type === "pomodoro" ? 25 * 60 : type === "short-break" ? 5 * 60 : 15 * 60)
    setIsRunning(false)
  }

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { text: newTask, importance: newTaskImportance, completed: false }])
      setNewTask("")
      setNewTaskImportance("low")
    }
  }

  const handleTaskComplete = (index: number) => {
    const updatedTasks = [...tasks]
    updatedTasks[index].completed = !updatedTasks[index].completed
    setTasks(updatedTasks)
    setTasksCompleted((prevCount) => prevCount + 1)
    toast.success("Tarea completada! 😊", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    })
  }

  const handleTaskDelete = (index: number) => {
    const updatedTasks = [...tasks]
    updatedTasks.splice(index, 1)
    setTasks(updatedTasks)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTask()
    }
  }

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value)
  }

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`min-h-screen p-8 space-y-8 ${isDarkMode ? "dark bg-[#1a1a1a]" : "bg-[#f0f0f0]"}`}>
      <div className="flex justify-end">
        <button
          className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-[#2d2d2d] text-white" : "bg-gray-500 text-white"}`}
          onClick={handleToggleDarkMode}
        >
          {isDarkMode ? "\u2600\uFE0F" : "\uD83C\uDF19"}
        </button>
      </div>
      <h1 className={`text-4xl font-bold text-center ${isDarkMode ? "text-white" : ""}`}>
        ¡Hola, {userName || "usuario"}!{" "}
        <span role="img" aria-label="wave">
          👋
        </span>
      </h1>
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Ingresa tu nombre"
          className={`px-4 py-2 border rounded-lg ${
            isDarkMode ? "bg-[#2d2d2d] text-white border-[#4d4d4d]" : "bg-white border-gray-400"
          }`}
          value={userName}
          onChange={handleUserNameChange}
        />
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div
          className={`p-8 border rounded-lg shadow ${
            isDarkMode ? "bg-[#2d2d2d] text-white border-[#4d4d4d]" : "bg-white border-gray-400"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">
            To-Do List{" "}
            <span role="img" aria-label="check">
              ✅
            </span>
          </h2>
          <div className="flex items-center space-x-4 mb-4">
            <input
              type="text"
              placeholder="Add your text"
              className={`flex-1 px-4 py-2 border rounded-lg ${
                isDarkMode ? "bg-[#3d3d3d] text-white border-[#4d4d4d]" : "bg-white border-gray-400"
              }`}
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={handleKeyPress}
              required
            />
            <button
              className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-[#4d4d4d] text-white" : "bg-blue-500 text-white"}`}
              onClick={handleAddTask}
            >
              Add
            </button>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <select
              className={`px-4 py-2 border rounded-lg ${
                isDarkMode ? "bg-[#3d3d3d] text-white border-[#4d4d4d]" : "bg-white border-gray-400"
              }`}
              value={newTaskImportance}
              onChange={(e) => setNewTaskImportance(e.target.value as "low" | "medium" | "high")}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {tasks.map((task, index) => (
              <div
                key={index}
                className={`flex items-center justify-between px-4 py-2 border rounded-lg ${
                  task.completed ? "line-through text-gray-500" : ""
                } ${
                  task.importance === "low"
                    ? "border-green-500"
                    : task.importance === "medium"
                    ? "border-orange-500"
                    : "border-red-500"
                } ${isDarkMode ? "bg-[#3d3d3d] text-white border-[#4d4d4d]" : "bg-white border-gray-400"}`}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleTaskComplete(index)}
                    className="w-4 h-4 text-blue-500 rounded"
                  />
                  <span>{task.text}</span>
                </div>
                <button
                  className={`px-2 py-1 text-gray-500 rounded-lg ${isDarkMode ? "text-gray-400" : ""}`}
                  onClick={() => handleTaskDelete(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
        <div
          className={`p-8 border rounded-lg shadow ${
            isDarkMode ? "bg-[#2d2d2d] text-white border-[#4d4d4d]" : "bg-white border-gray-400"
          }`}
        >
          <div className="flex justify-between mb-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                timerType === "pomodoro"
                  ? `bg-blue-500 text-white ${isDarkMode ? "bg-[#4d4d4d]" : ""}`
                  : `border ${isDarkMode ? "border-[#4d4d4d]" : "border-gray-400"}`
              }`}
              onClick={() => handleTimerTypeChange("pomodoro")}
            >
              Pomodoro
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                timerType === "short-break"
                  ? `bg-blue-500 text-white ${isDarkMode ? "bg-[#4d4d4d]" : ""}`
                  : `border ${isDarkMode ? "border-[#4d4d4d]" : "border-gray-400"}`
              }`}
              onClick={() => handleTimerTypeChange("short-break")}
            >
              Short Break
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                timerType === "long-break"
                  ? `bg-blue-500 text-white ${isDarkMode ? "bg-[#4d4d4d]" : ""}`
                  : `border ${isDarkMode ? "border-[#4d4d4d]" : "border-gray-400"}`
              }`}
              onClick={() => handleTimerTypeChange("long-break")}
            >
              Long Break
            </button>
          </div>
          <div className={`text-6xl font-bold text-center mb-4 ${isDarkMode ? "text-white" : ""}`}>
            {formatTime(timeRemaining)}
          </div>
          <div className="flex justify-center space-x-4">
            <button
              className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-[#4d4d4d] text-white" : "bg-blue-500 text-white"}`}
              onClick={isRunning ? handlePause : handleStart}
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              className={`px-4 py-2 border rounded-lg ${
                isDarkMode ? "border-[#4d4d4d] text-white" : "border-gray-400"
              }`}
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
        <div
          className={`p-8 border rounded-lg shadow flex items-center ${
            isDarkMode ? "bg-[#2d2d2d] text-white border-[#4d4d4d]" : "bg-white border-gray-400"
          }`}
        >
          <img src="/placeholder.svg" alt="Statistics" className="w-24 h-24 mr-4" />
          <div>
            <h2 className="text-2xl font-bold">Tus Estadísticas</h2>
            <p className={`text-gray-500 ${isDarkMode ? "text-gray-400" : ""}`}>
              Has completado {tasksCompleted} tareas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
