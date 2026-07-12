import { Router } from "express";
import { requireAuth, getSessionUser, blockDemoDelete } from "../middleware/auth.js";
import { createNoteSchema, updateNoteSchema } from "../lib/validation.js";
import * as noteService from "../services/noteService.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const notes = await noteService.listNotes(req.params.id, user.dataType);
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = createNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const note = await noteService.createNote(req.params.id, parsed.data, user.dataType);
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

const noteByIdRouter = Router();

noteByIdRouter.use(requireAuth);

noteByIdRouter.put("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = updateNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const note = await noteService.updateNote(req.params.id, parsed.data, user.dataType);
    res.json(note);
  } catch (error) {
    next(error);
  }
});

noteByIdRouter.delete("/:id", blockDemoDelete, async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    await noteService.deleteNote(req.params.id, user.dataType);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export { router as projectNotesRouter, noteByIdRouter };
