import { BarChart3Icon, TrendingUpIcon, ClockIcon, CodeIcon, TargetIcon, BrainIcon, Loader2Icon } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Line, Bar } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query';
import { getUserStats, getUserSubmissions } from '../lib/submissions';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function AnalyticsPage() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['userStats'],
        queryFn: getUserStats,
    });

    const { data: submissions = [] } = useQuery({
        queryKey: ['userSubmissions'],
        queryFn: getUserSubmissions,
    });

    const dailyCounts = Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - (6 - index));
        return submissions.filter((submission) => {
            const created = new Date(submission.createdAt);
            return created >= date && created < new Date(date.getTime() + 86400000);
        }).length;
    });

    const performanceData = {
        labels: ['6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
        datasets: [
            {
                label: 'Problems Solved',
                data: dailyCounts,
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const difficultyData = {
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [
            {
                label: 'Problems by Difficulty',
                data: [
                    stats?.easyProblems || 0,
                    stats?.mediumProblems || 0,
                    stats?.hardProblems || 0
                ],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    'rgb(16, 185, 129)',
                    'rgb(245, 158, 11)',
                    'rgb(239, 68, 68)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: 'rgb(156, 163, 175)',
                },
            },
        },
        scales: {
            y: {
                ticks: { color: 'rgb(156, 163, 175)' },
                grid: { color: 'rgba(156, 163, 175, 0.1)' },
            },
            x: {
                ticks: { color: 'rgb(156, 163, 175)' },
                grid: { color: 'rgba(156, 163, 175, 0.1)' },
            },
        },
    };

    const successRate = stats?.totalSubmissions > 0
        ? Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100)
        : 0;

    const cards = [
        {
            title: 'Average Time',
            value: '-',
            change: submissions.length ? `${submissions.length} total` : 'No data',
            icon: ClockIcon,
            color: 'primary',
            trend: 'down',
        },
        {
            title: 'Success Rate',
            value: `${successRate}%`,
            change: stats?.totalSubmissions ? `${stats.totalSubmissions} submissions` : 'No data',
            icon: TargetIcon,
            color: 'success',
            trend: 'up',
        },
        {
            title: 'Problems Solved',
            value: stats?.problemsSolved || 0,
            change: stats?.acceptedSubmissions ? `${stats.acceptedSubmissions} accepted` : 'No data',
            icon: CodeIcon,
            color: 'secondary',
            trend: 'up',
        },
        {
            title: 'Global Rank',
            value: stats?.rank ? `#${stats.rank}` : '-',
            change: stats?.rank ? `Rank ${stats.rank}` : 'No data',
            icon: BrainIcon,
            color: 'accent',
            trend: 'up',
        },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-300 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2Icon className="w-12 h-12 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-300">
            <Navbar />

            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-6 animate-slide-down">
                    <h1 className="text-4xl font-bold gradient-text-animated flex items-center gap-3">
                        <BarChart3Icon className="w-10 h-10" />
                        Analytics Dashboard
                    </h1>
                    <p className="text-base-content/70 mt-2">Track your progress and performance metrics</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {cards.map((stat, index) => (
                        <div
                            key={stat.title}
                            className="glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-lg bg-${stat.color}/20 flex items-center justify-center`}>
                                    <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === 'up' ? 'text-success' : 'text-error'
                                    }`}>
                                    <TrendingUpIcon className={`w-4 h-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                                    {stat.change}
                                </div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{stat.value}</div>
                            <div className="text-sm text-base-content/60">{stat.title}</div>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Performance Chart */}
                    <div className="glass rounded-2xl p-6 animate-fade-in">
                        <h2 className="text-xl font-bold mb-4">Weekly Performance</h2>
                        <div className="h-64">
                            <Line data={performanceData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Difficulty Distribution */}
                    <div className="glass rounded-2xl p-6 animate-fade-in">
                        <h2 className="text-xl font-bold mb-4">Problems by Difficulty</h2>
                        <div className="h-64">
                            <Bar data={difficultyData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Insights */}
                <div className="glass rounded-2xl p-6 animate-fade-in">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <BrainIcon className="w-6 h-6 text-primary" />
                        AI-Powered Insights
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-success/10 border border-success/30 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0">
                                    <TrendingUpIcon className="w-5 h-5 text-success" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-success mb-1">Strong Performance</h3>
                                    <p className="text-sm text-base-content/70">
                                        You're solving problems 20% faster than last week. Keep up the great work!
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
                                    <TargetIcon className="w-5 h-5 text-warning" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-warning mb-1">Focus Area</h3>
                                    <p className="text-sm text-base-content/70">
                                        {stats?.hardProblems ? `You have solved ${stats.hardProblems} hard problems.` : 'Submit solutions to build a difficulty profile.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-info/10 border border-info/30 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-info/20 flex items-center justify-center flex-shrink-0">
                                    <CodeIcon className="w-5 h-5 text-info" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-info mb-1">Code Quality</h3>
                                    <p className="text-sm text-base-content/70">
                                        {stats?.acceptedSubmissions ? `${stats.acceptedSubmissions} accepted submissions are recorded.` : 'Accepted submissions will appear here.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                                    <ClockIcon className="w-5 h-5 text-secondary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-secondary mb-1">Consistency</h3>
                                    <p className="text-sm text-base-content/70">
                                        You've maintained a {stats?.streak || 0}-day streak. Try to code daily for better results!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnalyticsPage;
