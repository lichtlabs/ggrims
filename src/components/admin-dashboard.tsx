"use client"

import { useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
} from "chart.js"
import {
  CalendarDays,
  DollarSign,
  PlusCircle,
  Ticket,
  Users
} from "lucide-react"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import { UpcomingEvent } from "@/types"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

// Mock data - replace with actual data fetching in a real application
const revenueData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Revenue",
      data: [12000, 19000, 3000, 5000, 2000, 3000],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1
    }
  ]
}

const ticketSalesData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Ticket Sales",
      data: [500, 800, 300, 400, 200, 350],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1
    }
  ]
}

const upcomingEvents: UpcomingEvent[] = [
  {
    id: 1,
    name: "Summer Beach Party",
    date: "2024-07-15",
    ticketsSold: 250,
    revenue: 5000
  },
  {
    id: 2,
    name: "Neon Nights Rave",
    date: "2024-08-05",
    ticketsSold: 400,
    revenue: 8000
  },
  {
    id: 3,
    name: "Vintage Gala",
    date: "2024-09-20",
    ticketsSold: 150,
    revenue: 7500
  }
]

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart"
    }
  }
  // scales: {
  //   x: {
  //     type: "category"
  //   },
  //   y: {
  //     type: "linear",
  //     beginAtZero: true
  //   }
  // }
}

export function AdminDashboardComponent() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/create-event">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <Button
          onClick={() => setActiveTab("overview")}
          variant={activeTab === "overview" ? "default" : "outline"}
          className="mr-2"
        >
          Overview
        </Button>
        <Button
          onClick={() => setActiveTab("events")}
          variant={activeTab === "events" ? "default" : "outline"}
        >
          Upcoming Events
        </Button>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tickets Sold
                </CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,350</div>
                <p className="text-xs text-muted-foreground">
                  +15% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Events
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  3 new this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Attendees
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">11,573</div>
                <p className="text-xs text-muted-foreground">
                  +7.4% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Bar data={revenueData} options={chartOptions} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ticket Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <Line data={ticketSalesData} options={chartOptions} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "events" && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              An overview of your next events and their performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Tickets Sold</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>{event.ticketsSold}</TableCell>
                    <TableCell>${event.revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
