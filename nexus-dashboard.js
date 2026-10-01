/* =========================================================
   NEXUS DASHBOARD
   VERSION: 2026-10-01
========================================================= */

console.log("NEXUS DASHBOARD JS v20261001 LOADED");

/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL = "https://rjtzurluhylqvfbwajwv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_gYy7X9szI2XlzIwasv1_XA_qg5gJnsK";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

/* =========================================================
   DOM ELEMENTS
========================================================= */

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const menuToggle = document.getElementById("menuToggle");
const closeSidebar = document.getElementById("closeSidebar");
const logoutBtn = document.getElementById("logoutBtn");
const notificationBtn = document.getElementById("notificationBtn");
const notificationCount = document.getElementById("notificationCount");
const headerUserName = document.getElementById("headerUserName");
const headerUserRole = document.getElementById("headerUserRole");
const userAvatar = document.getElementById("userAvatar");
const welcomeTitle = document.getElementById("welcomeTitle");

const enrolledCourses = document.getElementById("enrolledCourses");
const averageProgress = document.getElementById("averageProgress");
const completedCourses = document.getElementById("completedCourses");
const quizAttempts = document.getElementById("quizAttempts");

const progressCourses = document.getElementById("progressCourses");
const completedLessons = document.getElementById("completedLessons");
const progressQuizzes = document.getElementById("progressQuizzes");
const overallProgress = document.getElementById("overallProgress");

const continueLearning = document.getElementById("continueLearning");
const recentActivity = document.getElementById("recentActivity");
const bookmarksList = document.getElementById("bookmarksList");
const currentYear = document.getElementById("currentYear");

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
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    console.log("Nexus dashboard DOM ready.");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
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
   NAVIGATION & UI LISTENERS
========================================================= */

function setupMobileSidebar() {
    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            sidebar?.classList.add("open");
            sidebarOverlay?.classList.add("open");
        });
    }

    if (closeSidebar) {
        closeSidebar.addEventListener("click", () => {
            sidebar?.classList.remove("open");
            sidebarOverlay?.classList.remove("open");
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", () => {
            sidebar?.classList.remove("open");
            sidebarOverlay?.classList.remove("open");
        });
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-item");
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            navLinks.forEach((item) => item.classList.remove("active"));
            link.classList.add("active");
        });
    });
}

function setupLogout() {
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            try {
                const { error } = await supabaseClient.auth.signOut();
                if (error) throw error;
                redirectToLogin();
            } catch (err) {
                console.error("Logout failed:", err);
                showToast("Logout failed. Please try again.", "error");
            }
        });
    }
}

function setupNotifications() {
    if (notificationBtn) {
        notificationBtn.addEventListener("click", () => {
            showToast("You have no new unread notifications.", "info");
        });
    }
}

function setupMarquee() {
    const marquee = document.getElementById("nexusMarquee");
    if (marquee) {
        marquee.classList.add("running");
    }
}

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
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("click", (e) => {
                e.preventDefault();
                showToast("Navigating section...", "info");
            });
        }
    });
}

function redirectToLogin() {
    window.location.href = "nexus.html";
}

function showToast(message, type = "info") {
    console.log(`[Toast - \({type.toUpperCase()}]:\){message}`);
}

/* =========================================================
   DASHBOARD LOADER
========================================================= */

async function loadDashboard() {
    try {
        console.log("Nexus: checking session...");

        const { data, error } = await supabaseClient.auth.getSession();

        if (error || !data?.session?.user) {
            console.warn("No active session or auth error:", error);
            redirectToLogin();
            return;
        }

        currentUser = data.session.user;
        console.log("Nexus user connected:", currentUser.id);

        await loadProfile();
        await loadDashboardData();

        renderUser();
        renderStatistics();
        renderProgress();

    } catch (error) {
        console.error("Dashboard startup error:", error);
        showToast("Dashboard error during load.", "error");
    }
}

/* =========================================================
   PROFILE & USER DATA
========================================================= */

async function loadProfile() {
    if (!currentUser) return;

    try {
        const { data, error } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .maybeSingle();

        if (error) {
            console.error("Profile query error:", error);
            currentProfile = null;
            return;
        }

        currentProfile = data || null;
    } catch (error) {
        console.error("Profile exception:", error);
        currentProfile = null;
    }
}

async function loadDashboardData() {
    if (!currentUser) return;

    try {
        const [enrollmentsRes, progressRes, quizRes, bookmarksRes] = await Promise.all([
            supabaseClient.from("enrollments").select("*").eq("user_id", currentUser.id),
            supabaseClient.from("lesson_progress").select("*").eq("user_id", currentUser.id),
            supabaseClient.from("quiz_attempts").select("*").eq("user_id", currentUser.id),
            supabaseClient.from("bookmarks").select("*").eq("user_id", currentUser.id)
        ]);

        userEnrollments = enrollmentsRes.data || [];
        userLessonProgress = progressRes.data || [];
        userQuizAttempts = quizRes.data || [];
        userBookmarks = bookmarksRes.data || [];
    } catch (err) {
        console.error("Data fetching error:", err);
    }
}

function renderUser() {
    if (!currentUser) return;

    const metadata = currentUser.user_metadata || {};
    
    // Check Profile full_name -> Auth metadata -> Email prefix -> Fallback
    const fullName = currentProfile?.full_name 
        || metadata.full_name 
        || metadata.name 
        || (currentUser.email ? currentUser.email.split("@")[0] : "Nexus User");

    const role = currentProfile?.role || "student";

    if (headerUserName) headerUserName.textContent = fullName;
    if (headerUserRole) headerUserRole.textContent = role.toUpperCase();
    
    if (welcomeTitle) {
        const firstName = fullName.split(" ")[0];
        welcomeTitle.textContent = `Welcome back, ${firstName}! 👋`;
    }

    if (userAvatar) {
        userAvatar.textContent = fullName.charAt(0).toUpperCase();
    }
}

function renderStatistics() {
    if (enrolledCourses) enrolledCourses.textContent = userEnrollments.length;
    if (completedCourses) {
        const completed = userEnrollments.filter(e => e.status === "completed").length;
        completedCourses.textContent = completed;
    }
    if (quizAttempts) quizAttempts.textContent = userQuizAttempts.length;
}

function renderProgress() {
    const totalEnrolled = userEnrollments.length;
    if (progressCourses) progressCourses.textContent = totalEnrolled;
    if (completedLessons) completedLessons.textContent = userLessonProgress.filter(p => p.completed).length;
    if (progressQuizzes) progressQuizzes.textContent = userQuizAttempts.length;

    let avg = 0;
    if (totalEnrolled > 0) {
        const sum = userEnrollments.reduce((acc, curr) => acc + (curr.progress || 0), 0);
        avg = Math.round(sum / totalEnrolled);
    }

    if (averageProgress) averageProgress.textContent = avg;
    if (overallProgress) overallProgress.textContent = `${avg}%`;
}