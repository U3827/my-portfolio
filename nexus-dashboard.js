/* =========================================================
   NEXUS STUDENT DASHBOARD
   Supabase-connected dashboard
   ========================================================= */


/* =========================================================
   SUPABASE CONFIGURATION
   ========================================================= */

const SUPABASE_URL = "https://rjtzurluhylqvfbwajwv.supabase.co";

/*
   Use the SAME publishable key already used by your
   Nexus login and registration files.
*/
const SUPABASE_PUBLISHABLE_KEY = "PASTE_YOUR_EXISTING_PUBLISHABLE_KEY_HERE";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let currentUser = null;
let currentProfile = null;

let dashboardData = {
    enrollments: [],
    lessonProgress: [],
    quizAttempts: [],
    bookmarks: [],
    notifications: []
};


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    setupYear();

    setupMobileSidebar();

    setupButtons();

    createColorMarquee();

    await loadDashboard();

});


/* =========================================================
   YEAR
   ========================================================= */

function setupYear() {

    const yearElement = $("#currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

}


/* =========================================================
   AUTHENTICATION
   ========================================================= */

async function loadDashboard() {

    try {

        const {
            data: {
                session
            },
            error
        } = await supabaseClient.auth.getSession();


        if (error) {
            throw error;
        }


        /*
           No active session means the user should not
           remain on the private dashboard.
        */

        if (!session || !session.user) {

            window.location.href = "nexus-login.html";

            return;
        }


        currentUser = session.user;


        await loadUserProfile();

        await loadDashboardData();

        renderDashboard();


    } catch (error) {

        console.error(
            "Nexus dashboard error:",
            error
        );

        showDashboardError(
            "We couldn't load your dashboard. Please refresh the page."
        );

    }

}


/* =========================================================
   USER PROFILE
   ========================================================= */

async function loadUserProfile() {

    const {
        data,
        error
    } = await supabaseClient
        .from("profiles")
        .select(`
            id,
            full_name,
            role,
            avatar_url,
            created_at
        `)
        .eq("id", currentUser.id)
        .maybeSingle();


    if (error) {
        throw error;
    }


    currentProfile = data;


    /*
       If the profile doesn't exist, don't crash the
       dashboard. Use the Auth user's metadata instead.
    */

    if (!currentProfile) {

        currentProfile = {
            id: currentUser.id,

            full_name:
                currentUser.user_metadata?.full_name ||
                currentUser.email?.split("@")[0] ||
                "Nexus User",

            role: "student"
        };

    }

}


/* =========================================================
   LOAD DASHBOARD DATA
   ========================================================= */

async function loadDashboardData() {

    const userId = currentUser.id;


    /*
       These requests are protected by Supabase RLS.
       A normal student can only retrieve their own
       private data.
    */

    const [
        enrollmentsResult,
        progressResult,
        quizResult,
        bookmarksResult,
        notificationsResult
    ] = await Promise.all([


        supabaseClient
            .from("enrollments")
            .select(`
                id,
                course_id,
                status,
                progress_percent,
                enrolled_at,
                completed_at
            `)
            .eq("user_id", userId)
            .order("enrolled_at", {
                ascending: false
            }),


        supabaseClient
            .from("lesson_progress")
            .select(`
                id,
                lesson_id,
                completed,
                progress_percent,
                last_position_seconds,
                started_at,
                completed_at,
                updated_at
            `)
            .eq("user_id", userId)
            .order("updated_at", {
                ascending: false
            }),


        supabaseClient
            .from("quiz_attempts")
            .select(`
                id,
                quiz_id,
                attempt_number,
                score,
                percentage,
                passed,
                started_at,
                submitted_at
            `)
            .eq("user_id", userId)
            .order("submitted_at", {
                ascending: false
            }),


        supabaseClient
            .from("bookmarks")
            .select(`
                id,
                lesson_id,
                created_at
            `)
            .eq("user_id", userId)
            .order("created_at", {
                ascending: false
            }),


        supabaseClient
            .from("notifications")
            .select(`
                id,
                title,
                message,
                type,
                is_read,
                created_at
            `)
            .eq("user_id", userId)
            .order("created_at", {
                ascending: false
            })
            .limit(20)

    ]);


    /*
       Check each query separately.
    */

    if (enrollmentsResult.error) {
        throw enrollmentsResult.error;
    }

    if (progressResult.error) {
        throw progressResult.error;
    }

    if (quizResult.error) {
        throw quizResult.error;
    }

    if (bookmarksResult.error) {
        throw bookmarksResult.error;
    }

    if (notificationsResult.error) {
        throw notificationsResult.error;
    }


    dashboardData.enrollments =
        enrollmentsResult.data || [];

    dashboardData.lessonProgress =
        progressResult.data || [];

    dashboardData.quizAttempts =
        quizResult.data || [];

    dashboardData.bookmarks =
        bookmarksResult.data || [];

    dashboardData.notifications =
        notificationsResult.data || [];

}


/* =========================================================
   RENDER DASHBOARD
   ========================================================= */

function renderDashboard() {

    renderUser();

    renderStatistics();

    renderProgress();

    renderContinueLearning();

    renderRecentActivity();

    renderBookmarks();

    renderNotifications();

}


/* =========================================================
   USER INFORMATION
   ========================================================= */

function renderUser() {

    const fullName =
        currentProfile?.full_name ||
        "Nexus User";


    const firstName =
        fullName
            .trim()
            .split(/\s+/)[0];


    const role =
        currentProfile?.role ||
        "student";


    const formattedRole =
        formatRole(role);


    const welcomeTitle =
        $("#welcomeTitle");

    const headerUserName =
        $("#headerUserName");

    const headerUserRole =
        $("#headerUserRole");

    const avatar =
        $("#userAvatar");


    if (welcomeTitle) {

        welcomeTitle.textContent =
            `Welcome back, ${firstName}! 👋`;

    }


    if (headerUserName) {

        headerUserName.textContent =
            fullName;

    }


    if (headerUserRole) {

        headerUserRole.textContent =
            formattedRole;

    }


    if (avatar) {

        avatar.textContent =
            getInitials(fullName);

    }

}


/* =========================================================
   STATISTICS
   ========================================================= */

function renderStatistics() {

    const enrollments =
        dashboardData.enrollments;


    const completedCourses =
        enrollments.filter(
            enrollment =>
                enrollment.status === "completed"
        ).length;


    const totalProgress =
        enrollments.reduce(
            (sum, enrollment) =>
                sum +
                Number(
                    enrollment.progress_percent || 0
                ),
            0
        );


    const averageProgress =
        enrollments.length
            ? Math.round(
                totalProgress /
                enrollments.length
            )
            : 0;


    const completedLessons =
        dashboardData.lessonProgress
            .filter(
                item => item.completed
            )
            .length;


    setText(
        "#enrolledCourses",
        enrollments.length
    );


    setText(
        "#completedCourses",
        completedCourses
    );


    setText(
        "#averageProgress",
        averageProgress
    );


    setText(
        "#quizAttempts",
        dashboardData.quizAttempts.length
    );


    setText(
        "#progressCourses",
        enrollments.length
    );


    setText(
        "#completedLessons",
        completedLessons
    );


    setText(
        "#progressQuizzes",
        dashboardData.quizAttempts.length
    );

}


/* =========================================================
   OVERALL PROGRESS
   ========================================================= */

function renderProgress() {

    const enrollments =
        dashboardData.enrollments;


    const totalProgress =
        enrollments.reduce(
            (sum, enrollment) =>
                sum +
                Number(
                    enrollment.progress_percent || 0
                ),
            0
        );


    const percentage =
        enrollments.length
            ? Math.round(
                totalProgress /
                enrollments.length
            )
            : 0;


    setText(
        "#overallProgress",
        `${percentage}%`
    );


    const circle =
        $(".progress-circle");


    if (circle) {

        const degrees =
            Math.max(
                0,
                Math.min(
                    100,
                    percentage
                )
            ) * 3.6;


        circle.style.background =
            `conic-gradient(
                #8b5cf6 0deg,
                #22d3ee ${degrees}deg,
                rgba(255,255,255,0.07) ${degrees}deg,
                rgba(255,255,255,0.07) 360deg
            )`;

    }

}


/* =========================================================
   CONTINUE LEARNING
   ========================================================= */

function renderContinueLearning() {

    const container =
        $("#continueLearning");


    if (!container) {
        return;
    }


    const activeCourses =
        dashboardData.enrollments
            .filter(
                enrollment =>
                    enrollment.status === "active"
            );


    if (!activeCourses.length) {

        return;

    }


    /*
       We don't yet have the course catalog page,
       so for now show the real enrollment data
       without pretending we know the course title.
    */

    container.innerHTML =
        activeCourses
            .slice(0, 3)
            .map(
                enrollment => {

                    const progress =
                        Number(
                            enrollment.progress_percent || 0
                        );


                    return `
                        <div class="course-progress-item">

                            <div class="course-progress-icon">
                                N
                            </div>

                            <div class="course-progress-info">

                                <strong>
                                    Enrolled Course
                                </strong>

                                <span>
                                    Course ID:
                                    ${escapeHTML(
                                        String(
                                            enrollment.course_id
                                        ).slice(0, 8)
                                    )}...
                                </span>

                                <div class="mini-progress">
                                    <span
                                        style="width:${progress}%">
                                    </span>
                                </div>

                            </div>

                            <strong class="course-percent">
                                ${progress}%
                            </strong>

                        </div>
                    `;

                }
            )
            .join("");


    addDynamicCourseStyles();

}


/* =========================================================
   RECENT ACTIVITY
   ========================================================= */

function renderRecentActivity() {

    const container =
        $("#recentActivity");


    if (!container) {
        return;
    }


    const activities = [];


    dashboardData.quizAttempts
        .slice(0, 4)
        .forEach(
            attempt => {

                activities.push({

                    type: "quiz",

                    title:
                        "Quiz attempt recorded",

                    detail:
                        `${Number(
                            attempt.percentage || 0
                        )}% score`,

                    date:
                        attempt.submitted_at

                });

            }
        );


    dashboardData.lessonProgress
        .filter(
            item => item.completed
        )
        .slice(0, 4)
        .forEach(
            lesson => {

                activities.push({

                    type: "lesson",

                    title:
                        "Lesson completed",

                    detail:
                        "Learning progress updated",

                    date:
                        lesson.completed_at ||
                        lesson.updated_at

                });

            }
        );


    activities.sort(
        (a, b) =>
            new Date(b.date || 0) -
            new Date(a.date || 0)
    );


    if (!activities.length) {
        return;
    }


    container.innerHTML =
        activities
            .slice(0, 5)
            .map(
                activity => `

                    <div class="activity-item">

                        <div class="activity-icon">
                            ${
                                activity.type === "quiz"
                                    ? "✓"
                                    : "▶"
                            }
                        </div>

                        <div class="activity-info">

                            <strong>
                                ${escapeHTML(
                                    activity.title
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    activity.detail
                                )}
                            </span>

                        </div>

                        <time>
                            ${formatDate(
                                activity.date
                            )}
                        </time>

                    </div>

                `
            )
            .join("");


    addDynamicActivityStyles();

}


/* =========================================================
   BOOKMARKS
   ========================================================= */

function renderBookmarks() {

    const container =
        $("#bookmarksList");


    if (!container) {
        return;
    }


    if (!dashboardData.bookmarks.length) {
        return;
    }


    container.innerHTML =
        dashboardData.bookmarks
            .slice(0, 5)
            .map(
                bookmark => `

                    <div class="bookmark-item">

                        <div class="bookmark-icon">
                            🔖
                        </div>

                        <div class="bookmark-info">

                            <strong>
                                Saved Lesson
                            </strong>

                            <span>
                                Lesson ID:
                                ${escapeHTML(
                                    String(
                                        bookmark.lesson_id
                                    ).slice(0, 8)
                                )}...
                            </span>

                        </div>

                        <span class="bookmark-arrow">
                            →
                        </span>

                    </div>

                `
            )
            .join("");


    addDynamicBookmarkStyles();

}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function renderNotifications() {

    const count =
        dashboardData.notifications
            .filter(
                notification =>
                    !notification.is_read
            )
            .length;


    const notificationCount =
        $("#notificationCount");


    if (notificationCount) {

        notificationCount.textContent =
            count > 99
                ? "99+"
                : count;

        notificationCount.style.display =
            count
                ? "grid"
                : "none";

    }

}


/* =========================================================
   COLORFUL LETTER MARQUEE
   ========================================================= */

function createColorMarquee() {

    const messages = [

        "NEXUS • LEARN • BUILD • GROW •",

        "KEEP LEARNING • KEEP BUILDING •",

        "YOUR NEXT SKILL STARTS HERE •"

    ];


    const colors = [

        "#ff4d6d",
        "#ff9f1c",
        "#f9f871",
        "#38e8a4",
        "#22d3ee",
        "#4f7cff",
        "#a855f7",
        "#ec4899"

    ];


    /*
       Insert a real marquee above the welcome section.
    */

    const content =
        $(".dashboard-content");


    const welcome =
        $(".welcome-section");


    if (!content || !welcome) {
        return;
    }


    const marquee =
        document.createElement("div");


    marquee.className =
        "nexus-marquee";


    const track =
        document.createElement("div");


    track.className =
        "nexus-marquee-track";


    const createMessage =
        (message, copy = false) => {

            const wrapper =
                document.createElement("div");

            wrapper.className =
                "marquee-message";


            [...message].forEach(
                (character, index) => {

                    const span =
                        document.createElement("span
