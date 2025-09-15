export default function TestPage() {
    return (
      <div className="p-8 space-y-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Dark Mode Test Page
        </h1>
  
        {/* Box that flips colors */}
        <div className="p-6 rounded-lg bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
          <p>This box should be light gray on default theme, dark gray in dark theme.</p>
        </div>
  
        {/* Button that switches style */}
        <button className="px-4 py-2 rounded bg-blue-500 text-white dark:bg-yellow-400 dark:text-black">
          I change color in dark mode
        </button>
      </div>
    )
  }
  