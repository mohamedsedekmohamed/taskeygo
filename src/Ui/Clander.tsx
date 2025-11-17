import  { useState } from "react";
import { FaPlus, FaTrash,  FaSave, FaTimes } from "react-icons/fa";

interface MealNote {
  id: number;
  text: string;
  isEditing?: boolean;
}

type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

const daysOfWeek: Day[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const WeeklyMealPlanner: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [meals, setMeals] = useState<string[]>(["Breakfast", "Lunch", "Dinner"]);
  const [newMeal, setNewMeal] = useState("");
  const [notes, setNotes] = useState<Record<Day, Record<string, MealNote | null>>>(
    () =>
      Object.fromEntries(
        daysOfWeek.map((day) => [day, {}])
      ) as Record<Day, Record<string, MealNote | null>>
  );

  const [selectedCell, setSelectedCell] = useState<{ day: Day; meal: string } | null>(null);
  const [newNote, setNewNote] = useState("");

  const openCell = (day: Day, meal: string) => {
    setSelectedCell({ day, meal });
    setNewNote(notes[day][meal]?.text || "");
  };

  const saveNote = () => {
    if (!selectedCell) return;
    const { day, meal } = selectedCell;

    if (!newNote.trim()) {
      setNotes((prev) => ({
        ...prev,
        [day]: { ...prev[day], [meal]: null },
      }));
    } else {
      setNotes((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          [meal]: { id: Date.now(), text: newNote },
        },
      }));
    }

    setSelectedCell(null);
    setNewNote("");
  };

  const deleteMeal = (mealName: string) => {
    setMeals((prev) => prev.filter((m) => m !== mealName));
    setNotes((prev) => {
      const updated = { ...prev };
      daysOfWeek.forEach((day) => {
        delete updated[day][mealName];
      });
      return updated;
    });
  };

  const addMeal = () => {
    const mealName = newMeal.trim();
    if (!mealName || meals.includes(mealName)) return;
    setMeals((prev) => [...prev, mealName]);
    setNewMeal("");
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-6 bg-gradient-to-br from-green-50 to-teal-100">
      <h1 className="mb-4 text-2xl font-bold text-center text-teal-700 sm:text-3xl">
        🍱 Weekly Meal Planner
      </h1>

      <div className="flex flex-col items-center justify-center w-full gap-2 mb-6 sm:flex-row sm:gap-3">
        <label className="font-semibold text-gray-700">Select Week:</label>
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-lg sm:w-auto"
        >
          {Array.from({ length: 52 }, (_, i) => i + 1).map((week) => (
            <option key={week} value={week}>
              Week {week}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col w-full max-w-lg gap-2 mb-4 sm:flex-row">
        <input
          type="text"
          placeholder="Add new meal (e.g., Snack)"
          value={newMeal}
          onChange={(e) => setNewMeal(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-400"
        />
        <button
          onClick={addMeal}
          className="flex items-center justify-center gap-1 px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700"
        >
          <FaPlus /> Add Meal
        </button>
      </div>

      <div className="w-full max-w-5xl overflow-x-auto shadow-md rounded-xl">
        <table className="w-full bg-white border border-collapse border-gray-300">
          <thead className="text-gray-800 bg-teal-200">
            <tr>
              <th className="p-2 text-left">Day</th>
              {meals.map((meal) => (
                <th key={meal} className="relative p-2 text-center group whitespace-nowrap">
                  {meal}
                  <button
                    onClick={() => deleteMeal(meal)}
                    className="absolute text-red-500 opacity-0 right-1 top-1 group-hover:opacity-100 hover:text-red-700"
                  >
                    <FaTrash size={12} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {daysOfWeek.map((day) => (
              <tr key={day} className="border-t">
                <td className="p-2 font-semibold text-gray-700 bg-teal-50 whitespace-nowrap">
                  {day}
                </td>
                {meals.map((meal) => (
                  <td
                    key={meal}
                    onClick={() => openCell(day, meal)}
                    className="w-32 h-20 p-2 align-top border-l cursor-pointer hover:bg-teal-50"
                  >
                    {notes[day][meal]?.text ? (
                      <p
                        className="text-sm text-gray-700 truncate"
                        title={notes[day][meal]?.text}
                      >
                        {notes[day][meal]?.text}
                      </p>
                    ) : (
                      <span className="italic text-gray-400">Add...</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCell && (
        <div className="fixed inset-0 flex items-center justify-center px-2 bg-black/40">
          <div className="relative w-full max-w-md p-6 bg-white shadow-xl rounded-2xl">
            <button
              onClick={() => setSelectedCell(null)}
              className="absolute text-gray-500 top-3 right-3 hover:text-red-600"
            >
              <FaTimes />
            </button>

            <h2 className="mb-3 text-lg font-semibold text-center text-teal-700">
              {selectedCell.day} - {selectedCell.meal}
            </h2>

            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write your note..."
              className="w-full h-32 p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-400"
            />

            <button
              onClick={saveNote}
              className="w-full py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700"
            >
              <FaSave className="inline mr-2" /> Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyMealPlanner;
