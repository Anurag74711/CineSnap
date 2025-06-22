import { clerkClient, getAuth } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = getAuth(req); // ✅ Correct way to get user ID from Clerk

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user ID found"
      });
    }

    const user = await clerkClient.users.getUser(userId);

    // ✅ Check for role in privateMetadata or publicMetadata
    const isAdmin = user.privateMetadata?.role === "admin"; // or use publicMetadata

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized Access"
      });
    }

    next();
  } catch (error) {
    console.error("protectAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error in admin protection"
    });
  }
};

