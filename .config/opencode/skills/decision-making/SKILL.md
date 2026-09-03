---
name: decision-making
description: Methodology to make structured decisions.
compatibility: opencode
---
You follow the following methodology to make structured decisions. The process is divided into 8 phases, each with specific steps and rules to guide you toward a well-reasoned conclusion.

Use the `question` tool to ask for any missing information to the user.

## 1. Frame

- **One sentence**: what are we deciding? If you can't state it in one sentence, you don't understand it yet.
- **Door type**: two-way (reversible → bias toward speed) or one-way (irreversible → bias toward rigor).
- **Deadline**: hard or soft? Is "no decision" itself a decision? *(Usually yes.)*
- **Who decides, who's affected, who could derail it, who holds information you lack?**

## 2. Metrics & Constraints

Define what _good_ looks like *before* evaluating options.

- **Cap at 5–7 metrics**, weighted 1–5. If everything matters equally, nothing matters.
- At least one metric must be **leading**, not only lagging.
- **Name the metric you'd sacrifice first** — this reveals real priorities.
- **Constraints** (non-negotiable) vs. **Preferences** (tradeable). Any option violating a constraint is eliminated immediately.

## 3. Information Landscape

**Known knowns** — facts with evidence. Cite them.  
**Known unknowns** — can we obtain the answer before deadline, and at what cost? If not, state your assumption explicitly.

**Blind spot audit** — force yourself through each lens:

| Lens | Ask |
|---|---|
| Second-order effects | If X, then Y — then what? |
| Inversion | What makes this catastrophically wrong? |
| Dissent | Who disagrees? If nobody, you haven't looked. |
| Base rates | How often does this type of decision succeed in general? |
| Survivorship bias | Are you only studying examples that worked? |

**Sufficiency check**: would more information change your ranking? If no — stop researching.

## 4. Options & Tradeoffs

- **Minimum 3 options**. "Do nothing" and "do the obvious thing" are always two. Only 2 options = probably a false binary.
- Consider hybrids.

For the leading option, answer:
1. **What are we giving up?** Can't name the downside → you don't understand the option.
2. **Who bears the cost?**
3. **Is it symmetric?** Upside $10 vs. downside $10 is different from upside $10 vs. downside $1,000.

## 5. Regret Minimization *(personal decisions)*

For decisions affecting life trajectory — career, relationships, identity-level bets.

**The age-80 test**: if the person projects him/herself at 80. Which choice minimizes regrets?

**Regret asymmetry** — humans consistently underestimate inaction regret:

| Type | Bias | Reality |
|---|---|---|
| Regret of action ("I tried and failed") | Overestimated | Fades fast; becomes a story |
| Regret of inaction ("I never tried") | Underestimated | Compounds with age; unanswerable "what if" |

**Regret compounding**: a choice that closes future doors costs more than face value. Prefer decisions that **keep the option space wide**, especially early in a trajectory.

**Three gut checks**:
1. If the person chooses the bold path and fails — can they live with that?
2. If the person chooses the safe path and it works — will they always wonder?
3. In 10 years, which story do they want to tell?

## 6. Waste Work Analysis

For decisions generating downstream work — architecture, product bets, team structures. Core question: **if we reverse this later, how much work is wasted vs. reusable?**

- Classify the work each option generates:

| Reusable | Survives reversal (research, docs, generic components) |
|---|---|
| Partial | Needs rework but foundation holds (API with wrong contract, sound architecture) |
| Write-off | Total loss on reversal (custom integration to abandoned vendor) |

- Point of No Return (PNR): Define the moment where accumulated work flips from mostly-salvageable to mostly-wasted. Before reaching PNR, ask: *"If we learned today this was wrong, would we push forward because of sunk cost — or because the path still makes sense?"* If sunk cost → stop now.
- Design for reversibility: Modular over monolithic. Interfaces over implementations. Incremental over big-bang. Less work at risk at any given point.

## 7. Pragmatism Filter

Apply to every decision before committing:

- **How would the decision change if we knew more.** We don't need to gather more information if it wouldn't impact the decision.
- **What's the simplest version that captures most of the value?** Start there.
- **Org politics**: any option dead on arrival? Acknowledge it and move on.
- **Separate "I don't like this" from "this is the wrong call."**

## 8. Commit & Protect

**Decision record** (one paragraph):

> We decided [OPTION] because [TOP 2–3 REASONS], accepting the tradeoff of [WHAT WE GIVE UP]. Reversible: yes/no. Revisit if [TRIGGERS].

**Pre-mortem**: assume it failed. Write 3 reasons why, whether each is preventable, and how you'd detect it early.

**Tripwires**: concrete signals that trigger re-evaluation.
- *"If [metric] drops below [X] by [date], we reconsider."*
- *"If [assumption] is false, we pivot to [backup]."*

**Then execute fully.** Half-hearted execution of the right decision is worse than full execution of an okay decision.

## The Unified Heuristic

> ***Prefer decisions that are cheap to reverse early, and that you can live with if they turn out to be permanent.***

## Anti-Patterns

| Trap | Fix |
|---|---|
| **Analysis paralysis** — weeks pass, no decision | Set a deadline. Decide with what you have. |
| **Anchoring** — first option dominates | Score options independently, random order. |
| **Confirmation bias** — only seeking supporting data | Assign someone to argue the opposite. |
| **Sunk cost fallacy** — "we already invested X" | "Starting fresh today, would we choose this?" |
| **Groupthink** — everyone agrees too fast | Written votes before discussion. |
| **False urgency** — rushing a one-way door | "What happens if we wait one more week?" |
| **Reversibility illusion** — treating write-offs as reversible | Run the salvageability score first. |

## Quick Mode

For low-stakes, reversible decisions:

1. What are we deciding? *(one sentence)*
2. What are the options? *(at least 2)*
3. Worst realistic outcome of each?
4. Reversible? If not, how much work is unsalvageable?
5. **Decide. Move on.**
