import { useUser } from '@clerk/clerk-react';
import { UserIcon, MailIcon, CalendarIcon, TrophyIcon, CodeIcon, ClockIcon, AwardIcon, EditIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserStats } from '../lib/submissions';

function ProfilePage() {
    const { user } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const { data: stats = {} } = useQuery({ queryKey: ['userStats'], queryFn: getUserStats });

    const userStats = {
        problemsSolved: stats.problemsSolved || 0,
        totalSessions: stats.totalSubmissions || 0,
        totalTime: '-',
        successRate: stats.totalSubmissions ? Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100) : 0,
        currentStreak: stats.streak || 0,
        longestStreak: stats.streak || 0,
        rank: stats.rank || '-',
        achievements: [
            { id: 1, name: 'First Problem', icon: '🎯', earned: true },
            { id: 2, name: '10 Problems', icon: '🔥', earned: true },
            { id: 3, name: '50 Problems', icon: '💎', earned: false },
            { id: 4, name: 'Week Streak', icon: '⚡', earned: true },
            { id: 5, name: 'Interview Pro', icon: '🏆', earned: true },
            { id: 6, name: 'Code Master', icon: '👑', earned: false },
        ],
        skills: [
            { name: 'JavaScript', level: 90 },
            { name: 'Python', level: 75 },
            { name: 'Java', level: 60 },
            { name: 'Algorithms', level: 80 },
            { name: 'Data Structures', level: 85 },
        ],
        recentActivity: Array.from({ length: 365 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
            count: 0,
        })),
    };

    const getActivityColor = (count) => {
        if (count === 0) return 'bg-base-300';
        if (count === 1) return 'bg-success/30';
        if (count === 2) return 'bg-success/50';
        if (count === 3) return 'bg-success/70';
        return 'bg-success';
    };

    return (
        <div className="min-h-screen bg-base-300">
            <Navbar />

            <div className="container mx-auto px-6 py-8">
                {/* Profile Header */}
                <div className="glass rounded-2xl p-8 mb-6 animate-slide-down">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-lg">
                                <img src={user?.imageUrl} alt={user?.fullName} className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-10 h-10 bg-success rounded-full border-4 border-base-100 flex items-center justify-center">
                                <span className="text-xl">🔥</span>
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                                <h1 className="text-3xl font-bold">{user?.fullName}</h1>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="btn btn-circle btn-sm btn-ghost"
                                >
                                    <EditIcon className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-base-content/70 mb-4">
                                <div className="flex items-center gap-2">
                                    <MailIcon className="w-4 h-4" />
                                    <span>{user?.primaryEmailAddress?.emailAddress}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <span className="badge badge-primary badge-lg">Global Rank #{userStats.rank}</span>
                                <span className="badge badge-secondary badge-lg">{userStats.currentStreak} Day Streak 🔥</span>
                                <span className="badge badge-accent badge-lg">{userStats.successRate}% Success Rate</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="glass rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                                <CodeIcon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{userStats.problemsSolved}</div>
                                <div className="text-sm text-base-content/60">Problems Solved</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                                <UserIcon className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{userStats.totalSessions}</div>
                                <div className="text-sm text-base-content/60">Total Sessions</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                                <ClockIcon className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{userStats.totalTime}</div>
                                <div className="text-sm text-base-content/60">Coding Time</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                                <TrophyIcon className="w-6 h-6 text-warning" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{userStats.longestStreak}</div>
                                <div className="text-sm text-base-content/60">Longest Streak</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Activity Calendar */}
                    <div className="lg:col-span-2 glass rounded-2xl p-6 animate-fade-in">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <CalendarIcon className="w-6 h-6 text-primary" />
                            Activity Calendar
                        </h2>
                        <div className="overflow-x-auto">
                            <div className="grid grid-cols-52 gap-1">
                                {userStats.recentActivity.slice(0, 364).reverse().map((day, index) => (
                                    <div
                                        key={index}
                                        className={`w-3 h-3 rounded-sm ${getActivityColor(day.count)} hover:scale-150 transition-transform cursor-pointer`}
                                        title={`${day.date.toLocaleDateString()}: ${day.count} activities`}
                                    />
                                ))}
                            </div>
                            <div className="flex items-center gap-2 mt-4 text-sm text-base-content/60">
                                <span>Less</span>
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 rounded-sm bg-base-300" />
                                    <div className="w-3 h-3 rounded-sm bg-success/30" />
                                    <div className="w-3 h-3 rounded-sm bg-success/50" />
                                    <div className="w-3 h-3 rounded-sm bg-success/70" />
                                    <div className="w-3 h-3 rounded-sm bg-success" />
                                </div>
                                <span>More</span>
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="glass rounded-2xl p-6 animate-fade-in">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <AwardIcon className="w-6 h-6 text-primary" />
                            Skills
                        </h2>
                        <div className="space-y-4">
                            {userStats.skills.map((skill) => (
                                <div key={skill.name}>
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium">{skill.name}</span>
                                        <span className="text-sm text-base-content/60">{skill.level}%</span>
                                    </div>
                                    <div className="w-full bg-base-200 rounded-full h-2">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
                                            style={{ width: `${skill.level}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Achievements */}
                <div className="glass rounded-2xl p-6 mt-6 animate-fade-in">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <TrophyIcon className="w-6 h-6 text-primary" />
                        Achievements
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {userStats.achievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className={`p-4 rounded-xl text-center transition-all ${achievement.earned
                                    ? 'glass transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer'
                                    : 'bg-base-200 opacity-50 grayscale'
                                    }`}
                            >
                                <div className="text-4xl mb-2">{achievement.icon}</div>
                                <div className="text-sm font-medium">{achievement.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
