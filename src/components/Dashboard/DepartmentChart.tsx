import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const departmentData = [
  { name: "Engineering", value: 45, color: "hsl(var(--hr-chart-1))" },
  { name: "Sales", value: 28, color: "hsl(var(--hr-chart-2))" },
  { name: "Marketing", value: 22, color: "hsl(var(--hr-chart-3))" },
  { name: "HR", value: 15, color: "hsl(var(--hr-chart-4))" },
  { name: "Finance", value: 18, color: "hsl(var(--hr-chart-5))" },
  { name: "Operations", value: 14, color: "hsl(var(--accent))" },
];

export function DepartmentChart() {
  return (
    <Card className="shadow-card bg-gradient-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Department Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">Employee count by department</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={departmentData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {departmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
                boxShadow: "var(--shadow-dropdown)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {departmentData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}