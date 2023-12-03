import Team from "../models/team.js";
import User from "../models/user.js";

export async function addMember(req, res) {
  try {
    const { teamId, memberId } = req.params;
    const userId = req.userId;
    const team = await Team.findById(teamId);
    const teamMember = await User.findById(memberId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" }).populate("members");
    }

    if (!teamMember) {
      return res.status(404).json({ message: "User not found" });
    }

    if (teamMember.available == false) {
      return res.status(404).json({ message: "User is not available" });
    }

    if (team.members.includes(memberId)) {
      return res.status(400).json({ message: "User is already a member of the team" });
    }

    team.members.push(memberId);
    await team.save();

    res.status(200).json({ message: "User added to the team" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createTeam(req, res) {
  try {
    const { name, description, members } = req.body;
    const userId = req.userId;

    const newTeam = new Team({
      userId,
      name,
      description,
      members,
    });

    await newTeam.save();

    res.status(201).json({ message: "Team created successfully", team: newTeam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function removeMember(req, res) {
  try {
    const { teamId, userId } = req.params;
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (!team.members.includes(userId)) {
      return res.status(400).json({ message: "User is not a member of the team" });
    }

    team.members = team.members.filter(member => member.toString() !== userId);
    await team.save();

    res.status(200).json({ message: "User removed from the team", team });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMembers(req, res) {
  try {
    const userId = req.userId;

    const teamMembers = await Team.find({ userId });

    res.status(200).json({ teamMembers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getTeam(req, res) {
  try {
    const userId = req.userId;
    const teams = await Team.find({ userId }).populate("members").exec();
    res.status(200).json({ teams });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
