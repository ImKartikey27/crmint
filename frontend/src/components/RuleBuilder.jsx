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
    <div className="space-y-4 border border-gray-200 rounded-md p-4 bg-gray-50">
      {rules.map((rule, index) => (
        <div key={index} className="flex flex-wrap gap-3 items-center">
          <select
            value={rule.field}
            onChange={(e) => updateRule(index, "field", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
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
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
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
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            placeholder="Value"
          />

          <button
            type="button"
            onClick={() => removeRule(index)}
            className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addRule}
        className="mt-2 px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        + Add Rule
      </button>
    </div>
  )
}

export default RuleBuilder
