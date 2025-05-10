"use client"

function RuleBuilder({ rules, setRules }) {
  const fieldOptions = [
    { value: "spend", label: "Total Spend" },
    { value: "visits", label: "Number of Visits" },
    { value: "inactive", label: "Inactive for Days" },
    { value: "purchases", label: "Number of Purchases" },
    { value: "location", label: "Location" },
  ]

  const operatorOptions = [
    { value: ">", label: "Greater than" },
    { value: "<", label: "Less than" },
    { value: "=", label: "Equal to" },
    { value: "!=", label: "Not equal to" },
  ]

  const addCondition = (index, connector) => {
    const newRules = [...rules]
    newRules.splice(index + 1, 0, {
      id: Date.now(),
      type: "condition",
      field: "spend",
      operator: ">",
      value: "",
      connector,
    })
    setRules(newRules)
  }

  const removeRule = (id) => {
    if (rules.length === 1) {
      return // Don't remove the last rule
    }
    setRules(rules.filter((rule) => rule.id !== id))
  }

  const updateRule = (id, field, value) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule)))
  }

  const toggleConnector = (id) => {
    setRules(
      rules.map((rule) => (rule.id === id ? { ...rule, connector: rule.connector === "AND" ? "OR" : "AND" } : rule)),
    )
  }

  return (
    <div className="space-y-4 border border-gray-200 rounded-md p-4 bg-gray-50">
      {rules.map((rule, index) => (
        <div key={rule.id} className="space-y-3">
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={rule.field}
              onChange={(e) => updateRule(rule.id, "field", e.target.value)}
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
              onChange={(e) => updateRule(rule.id, "operator", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            >
              {operatorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={rule.value}
              onChange={(e) => updateRule(rule.id, "value", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              placeholder="Value"
            />

            <button
              type="button"
              onClick={() => removeRule(rule.id)}
              className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Remove
            </button>
          </div>

          {index < rules.length - 1 && (
            <div className="flex items-center pl-4">
              <button
                type="button"
                onClick={() => toggleConnector(rule.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  rule.connector === "AND" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
                }`}
              >
                {rule.connector}
              </button>
            </div>
          )}

          {index === rules.length - 1 && (
            <div className="flex space-x-2 pl-4">
              <button
                type="button"
                onClick={() => addCondition(index, "AND")}
                className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                + Add AND condition
              </button>
              <button
                type="button"
                onClick={() => addCondition(index, "OR")}
                className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                + Add OR condition
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default RuleBuilder
