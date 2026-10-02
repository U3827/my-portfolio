/* =========================================================
   NEXUS DASHBOARD
   VERSION: 2026-10-02 FIXED
========================================================= */

console.log("NEXUS DASHBOARD JS v20261002 LOADED");

/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://rjtzurluhylqvfbwajwv.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_gYy7X9szI2XlzIwasv1_XA_qg5gJnsK";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================================
   DOM ELEMENTS
========================================================= */

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const menuToggle =
    document.getElementById("menuToggle");

const closeSidebar =
    document.getElementById("closeSidebar");

const logoutBtn =
    document.getElementById("logoutBtn");

const notificationBtn =
    document.getElementById("notificationBtn");

const notificationCount =
    document.getElementById("notificationCount");

const headerUserName =
    document.getElementById("headerUserName");

const headerUserRole =
    document.getElementById("headerUserRole");

const userAvatar =
    document.getElementById("userAvatar");

const welcomeTitle =
    document.getElementById("welcomeTitle");

const enrolledCourses =
    document.getElementById("enrolledCourses");

const averageProgress =
    document.getElementById("averageProgress");

const completedCourses =
    document.getElementById("completedCourses");

const quizAttempts =
    document.getElementById("quizAttempts");

const progressCourses =
    document.getElementById("progressCourses");

const completedLessons =
    document.getElementById("completedLessons");

const progressQuizzes =
    document.getElementById("progressQuizzes");

const overallProgress =
    document.getElementById("overallProgress");

const continueLearning =
    document.getElementById("continueLearning");

const recentActivity =
    document.getElementById("recentActivity");

const bookmarksList =
    document.getElementById("bookmarksList");

const currentYear =
    document.getElementById("currentYear");


/* =========================================================
   STATE
========================================================= */

let currentUser = null;
let currentProfile = null;

let userEnrollments = [];
let userLessonProgress = [];
let userQuizAttempts = [];
let userBookmarks = [];
let userNotifications = [];


/* =========================================================
   START DASHBOARD
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Nexus dashboard DOM ready.");

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }

    setupMobileSidebar();
    setupNavigation();
    setupQuickActions();
    setupNotifications();
    setupMarquee();
    setupLogout();

    loadDashboard();
});


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function setupMobileSidebar() {

    if (menuToggle) {

        menuToggle.addEventListener("click", () => {

            sidebar?.classList.add("open");

            sidebarOverlay?.classList.add("open");

            sidebarOverlay?.setAttribute(
                "aria-hidden",
                "false"
            );

        });

    }


    if (closeSidebar) {

        closeSidebar.addEventListener("click", () => {

            closeMobileSidebar();

        });

    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener("click", () => {

            closeMobileSidebar();

        });

    }

}


function closeMobileSidebar() {

    sidebar?.classList.remove("open");

    sidebarOverlay?.classList.remove("open");

    sidebarOverlay?.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   SIDEBAR NAVIGATION
========================================================= */

function setupNavigation() {

    const navLinks =
        document.querySelectorAll(
            ".sidebar-nav .nav-item"
        );


    navLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            event.preventDefault();

            navLinks.forEach((item) => {

                item.classList.remove("active");

            });

            link.classList.add("active");

            closeMobileSidebar();


            const id = link.id;


            if (id === "coursesLink") {

                showToast(
                    "My Courses will open here.",
                    "info"
                );

            }

            else if (id === "exploreCoursesLink") {

                showToast(
                    "Course Explorer will open here.",
                    "info"
                );

            }

            else if (id === "quizzesLink") {

                showToast(
                    "Quizzes & Exams will open here.",
                    "info"
                );

            }

            else if (id === "bookmarksLink") {

                showToast(
                    "Your bookmarks will open here.",
                    "info"
                );

            }

            else if (id === "historyLink") {

                showToast(
                    "Your learning history will open here.",
                    "info"
                );

            }

            else if (id === "settingsLink") {

                showToast(
                    "Settings will open here.",
                    "info"
                );

            }

            else if (id === "helpLink") {

                showToast(
                    "Help & Support will open here.",
                    "info"
                );

            }

        });

    });

}


/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {

    if (!logoutBtn) {
        return;
    }


    logoutBtn.addEventListener(
        "click",
        async () => {

            logoutBtn.disabled = true;

            const originalText =
                logoutBtn.innerHTML;

            logoutBtn.innerHTML =
                "<span>↪</span><span>Logging out...</span>";


            try {

                const { error } =
                    await supabaseClient.auth.signOut();


                if (error) {

                    throw error;

                }


                showToast(
                    "You have been logged out.",
                    "success"
                );


                setTimeout(() => {

                    window.location.href =
                        "nexus-login.html";

                }, 500);


            }

            catch (error) {

                console.error(
                    "Nexus logout error:",
                    error
                );


                showToast(
                    "Logout failed. Please try again.",
                    "error"
                );


                logoutBtn.disabled = false;

                logoutBtn.innerHTML =
                    originalText;

            }

        }
    );

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function setupNotifications() {

    if (!notificationBtn) {
        return;
    }


    notificationBtn.addEventListener(
        "click",
        () => {

            if (userNotifications.length === 0) {

                showToast(
                    "You have no new notifications.",
                    "info"
                );

                return;

            }


            showToast(
                `You have ${userNotifications.length} notification${userNotifications.length === 1 ? "" : "s"}.`,
                "info"
            );

        }
    );

}


/* =========================================================
   QUICK ACTIONS
========================================================= */

function setupQuickActions() {

    const actionIds = [

        "quickExploreCourses",

        "quickQuiz",

        "quickBookmarks",

        "browseCoursesBtn",

        "viewCoursesBtn",

        "viewBookmarksBtn",

        "emptyExploreBtn"

    ];


    actionIds.forEach((id) => {

        const element =
            document.getElementById(id);


        if (!element) {
            return;
        }


        element.addEventListener(
            "click",
            (event) => {

                event.preventDefault();


                if (
                    id === "quickQuiz"
                ) {

                    showToast(
                        "Quiz section will open here.",
                        "info"
                    );

                }

                else if (
                    id === "quickBookmarks" ||
                    id === "viewBookmarksBtn"
                ) {

                    showToast(
                        "Bookmarks section will open here.",
                        "info"
                    );

                }

                else {

                    showToast(
                        "Course Explorer will open here.",
                        "info"
                    );

                }

            }
        );

    });

}


/* =========================================================
   MARQUEE
========================================================= */

function setupMarquee() {

    const marquee =
        document.getElementById("nexusMarquee");


    if (!marquee) {
        return;
    }


    marquee.classList.add("running");


    const track =
        marquee.querySelector(".marquee-track");


    if (!track) {
        return;
    }


    track.style.display = "flex";

    track.style.width = "max-content";

    track.style.animation =
        "nexusMarqueeMove 18s linear infinite";


    const styleId =
        "nexus-marquee-runtime-style";


    if (!document.getElementById(styleId)) {

        const style =
            document.createElement("style");


        style.id = styleId;


        style.textContent = `
            @keyframes nexusMarqueeMove {
                from {
                    transform: translateX(0);
                }

                to {
                    transform: translateX(-50%);
                }
            }

            .nexus-marquee {
                width: 100%;
                overflow: hidden;
            }

            .marquee-track {
                display: flex;
                width: max-content;
                white-space: nowrap;
            }

            .marquee-text {
                flex-shrink: 0;
                padding-right: 60px;
            }
        `;


        document.head.appendChild(style);

    }

}


/* =========================================================
   DASHBOARD LOADER
========================================================= */

async function loadDashboard() {

    try {

        console.log(
            "Nexus: checking session..."
        );


        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Session error:",
                error
            );

            redirectToLogin();

            return;

        }


        if (
            !data ||
            !data.session ||
            !data.session.user
        ) {

            console.warn(
                "No active Nexus session."
            );

            redirectToLogin();

            return;

        }


        currentUser =
            data.session.user;


        console.log(
            "Nexus user connected:",
            currentUser.id
        );


        await loadProfile();

        await loadDashboardData();

        renderUser();

        renderStatistics();

        renderProgress();

        renderContinueLearning();

        renderRecentActivity();

        renderBookmarks();

        renderNotifications();


        console.log(
            "Nexus dashboard loaded successfully."
        );

    }

    catch (error) {

        console.error(
            "Dashboard startup error:",
            error
        );


        showToast(
            "Dashboard could not finish loading.",
            "error"
        );

    }

}


/* =========================================================
   PROFILE
========================================================= */

async function loadProfile() {

    if (!currentUser) {
        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("profiles")
                .select("*")
                .eq(
                    "id",
                    currentUser.id
                )
                .maybeSingle();


        if (error) {

            console.error(
                "Profile query error:",
                error
            );

            currentProfile = null;

            return;

        }


        currentProfile =
            data || null;

    }

    catch (error) {

        console.error(
            "Profile exception:",
            error
        );

        currentProfile = null;

    }

}


/* =========================================================
   LOAD DASHBOARD DATA
========================================================= */

async function loadDashboardData() {

    if (!currentUser) {
        return;
    }


    try {

        const [
            enrollmentsRes,
            progressRes,
            quizRes,
            bookmarksRes,
            notificationsRes
        ] =
            await Promise.all([

                supabaseClient
                    .from("enrollments")
                    .select("*")
                    .eq(
                        "user_id",
                        currentUser.id
                    ),

                supabaseClient
                    .from("lesson_progress")
                    .select("*")
                    .eq(
                        "user_id",
                        currentUser.id
                    ),

                supabaseClient
                    .from("quiz_attempts")
                    .select("*")
                    .eq(
                        "user_id",
                        currentUser.id
                    ),

                supabaseClient
                    .from("bookmarks")
                    .select("*")
                    .eq(
                        "user_id",
                        currentUser.id
                    ),

                supabaseClient
                    .from("notifications")
                    .select("*")
                    .eq(
                        "user_id",
                        currentUser.id
                    )
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    )

            ]);


        if (enrollmentsRes.error) {

            console.error(
                "Enrollments error:",
                enrollmentsRes.error
            );

        }


        if (progressRes.error) {

            console.error(
                "Lesson progress error:",
                progressRes.error
            );

        }


        if (quizRes.error) {

            console.error(
                "Quiz attempts error:",
                quizRes.error
            );

        }


        if (bookmarksRes.error) {

            console.error(
                "Bookmarks error:",
                bookmarksRes.error
            );

        }


        if (notificationsRes.error) {

            console.error(
                "Notifications error:",
                notificationsRes.error
            );

        }


        userEnrollments =
            enrollmentsRes.data || [];


        userLessonProgress =
            progressRes.data || [];


        userQuizAttempts =
            quizRes.data || [];


        userBookmarks =
            bookmarksRes.data || [];


        userNotifications =
            notificationsRes.data || [];

    }

    catch (error) {

        console.error(
            "Dashboard data fetching error:",
            error
        );

    }

}


/* =========================================================
   RENDER USER
========================================================= */

function renderUser() {

    if (!currentUser) {
        return;
    }


    const metadata =
        currentUser.user_metadata || {};


    const fullName =

        currentProfile?.full_name ||

        metadata.full_name ||

        metadata.name ||

        (
            currentUser.email
                ? currentUser.email.split("@")[0]
                : "Nexus User"
        );


    const role =
        currentProfile?.role ||
        "student";


    if (headerUserName) {

        headerUserName.textContent =
            fullName;

    }


    if (headerUserRole) {

        headerUserRole.textContent =
            String(role).toUpperCase();

    }


    if (welcomeTitle) {

        const firstName =
            fullName.trim().split(/\s+/)[0];


        welcomeTitle.textContent =
            `Welcome back, ${firstName}! 👋`;

    }


    if (userAvatar) {

        userAvatar.textContent =
            fullName
                .trim()
                .charAt(0)
                .toUpperCase() || "U";

    }

}


/* =========================================================
   STATISTICS
========================================================= */

function renderStatistics() {

    const enrolled =
        userEnrollments.length;


    const completed =
        userEnrollments.filter(
            (course) =>
                course.status === "completed"
        ).length;


    const attempts =
        userQuizAttempts.length;


    if (enrolledCourses) {

        enrolledCourses.textContent =
            enrolled;

    }


    if (completedCourses) {

        completedCourses.textContent =
            completed;

    }


    if (quizAttempts) {

        quizAttempts.textContent =
            attempts;

    }

}


/* =========================================================
   PROGRESS
========================================================= */

function renderProgress() {

    const totalEnrolled =
        userEnrollments.length;


    const completedLessonCount =
        userLessonProgress.filter(
            (progress) =>
                progress.completed === true
        ).length;


    const totalQuizAttempts =
        userQuizAttempts.length;


    let totalProgress = 0;


    if (totalEnrolled > 0) {

        const sum =
            userEnrollments.reduce(
                (total, course) => {

                    const value =
                        Number(
                            course.progress_percent ??
                            course.progress ??
                            0
                        );


                    return total + value;

                },
                0
            );


        totalProgress =
            Math.round(
                sum / totalEnrolled
            );

    }


    if (progressCourses) {

        progressCourses.textContent =
            totalEnrolled;

    }


    if (completedLessons) {

        completedLessons.textContent =
            completedLessonCount;

    }


    if (progressQuizzes) {

        progressQuizzes.textContent =
            totalQuiz