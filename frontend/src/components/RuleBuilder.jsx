"use client"

function RuleBuilder({ rules, setRules }) {
  const fieldOptions = [
    { value: "spend", label: "Total Spend" },
    { value: "visits", label: "Number of Visits" },
    { value: "inactive_days", label: "Inactive for Days" }
  ]

  const operatorOptions = [
    { value: ">", label: "Greater than" },
    { value: "<", label: "Less than" },
    { value: "=", label: "Equal to" }
  ]

  const addRule = () => {
    setRules([
      ...rules,
      { field: "spend", operator: ">", value: "" }
    ])
  }

  const removeRule = (index) => {
    if (rules.length === 1) return
    const newRules = [...rules]
    newRules.splice(index, 1)
    setRules(newRules)
  }

  const updateRule = (index, field, value) => {
    const newRules = [...rules]
    newRules[index] = { ...newRules[index], [field]: value }
    setRules(newRules)
  }

  return (
    <div className="space-y-4 border border-indigo-100 rounded-xl p-6 bg-indigo-50/30">
      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div key={index} className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
            <select
              value={rule.field}
              onChange={(e) => updateRule(index, "field", e.target.value)}
              className="px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 text-gray-700"
            >
              {fieldOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={rule.operator}
              onChange={(e) => updateRule(index, "operator", e.target.value)}
              className="px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 text-gray-700"
            >
              {operatorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={rule.value}
              onChange={(e) => updateRule(index, "value", e.target.value)}
              className="px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 text-gray-700"
              placeholder="Enter value"
            />

            <button
              type="button"
              onClick={() => removeRule(index)}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              disabled={rules.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRule}
        className="mt-4 inline-flex items-center px-4 py-2 rounded-lg border border-indigo-500 text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
      >
        + Add Rule
      </button>
    </div>
  )
}

export default RuleBuilder