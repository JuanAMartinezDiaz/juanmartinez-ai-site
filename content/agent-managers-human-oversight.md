---
title: "Every AI Agent Needs a Manager. Here Is What the Job Actually Requires."
subtitle: "A practical guide to ownership, delegated authority, daily supervision, and evidence."
author: "Juan A. Martinez Diaz, MBA"
date: "2026-09-12"
slug: "agent-managers-human-oversight"
draft: false
meta_description: "What does an AI Agent Manager do? A practical guide to authority, oversight, performance, staffing, and lessons from BNY and Anthropic."
---

# Every AI Agent Needs a Manager. Here Is What the Job Actually Requires.

*A practical guide to ownership, delegated authority, daily supervision, and evidence.*

**By Juan A. Martinez Diaz, MBA**

Who manages an AI agent after it starts doing work? Keeping the technology running is only part of the responsibility. Someone needs to understand the assignment, the limits of the agent's authority, and the evidence required to trust its work. That includes challenging the work it considers complete, not just responding to the exceptions it raises.

My view is that we should treat agent management as an operating responsibility, with authority, time, and evidence attached to it. The point is not to pretend software has become a person. The point is to make sure responsibility does not disappear when work is delegated to software.

## What an Agent Manager actually manages

My working definition is straightforward: an Agent Manager is the designated human responsible for supervising an agent's work within an approved purpose and authority boundary. The manager translates business expectations into operating limits, reviews performance and exceptions, and acts when the evidence no longer supports continued operation. That responsibility does not displace the organization's accountable executive, process owner, or designated decision-maker. [1, 5]

An AI manager agent is different. It is software that divides work among other agents and combines their results. Anthropic's June 2025 account of its Research system describes this lead-agent and subagent arrangement. That is technical coordination, not a substitute for human accountability. An agent can assign a task; it cannot become the executive who accepts the business consequences. [3]

Microsoft's 2025 Work Trend Index used the term “agent boss” for people who build, delegate to, and manage agents. I read that as a useful workforce framing, not proof that every employer has established a mature Agent Manager role. [4]

## A banking example that makes the idea concrete

In October 2025, BNY reported deploying more than 100 digital employees with defined personas, credentials, and supervisors. It described these systems working alongside employees, including in payment operations. This is a company-reported implementation, not an independent assessment of control effectiveness. [2]

What interests me is the operating structure. The system has an assigned function, access associated with that function, and supervision. My takeaway is that an enterprise agent needs more than a useful prompt. It needs a defined place in a workflow, limits on its actions, and someone equipped to challenge its behavior.

Anthropic offers a complementary lesson. Its engineering account describes human testing identifying source-quality problems that automated evaluations missed. My interpretation is that coordinating agents and evaluating them automatically still leaves work for people who can recognize a plausible but inadequate result. [3]

## Start with delegated authority, not a personality

Before giving an agent a name, I would document its job. The operating charter should state its purpose, authorized data sources, allowed actions, prohibited actions, escalation conditions, and human decision rights. It should also identify the manager, backup, engineering support, and the evidence required to continue operating.

For a first deployment, I would make the permitted work narrower than the desired end-state. An agent might gather approved documents, identify missing fields, and prepare a draft. It would not automatically inherit authority to change the underlying record, send the draft outside the organization, or approve the decision it supports.

Some actions may proceed within boundaries, some require escalation, and some decisions should originate with a human. Safety should be built into the surrounding system rather than left to the model to police itself. [1]

My implementation rule would be simple: enforce important limits through access controls, workflow gates, and tested stop conditions. Do not make the agent's own confidence statement the sole permission to act. Expanding authority should require a documented approval and supporting evaluation, not merely a successful demonstration.

## What the manager does during an ordinary working day

Consider an illustrative technology-risk workflow. An agent gathers backup records and prepares an evidence package for a control review. The records show that scheduled backup jobs completed. The agent then drafts a conclusion suggesting that recovery capability has been demonstrated. This is a synthetic teaching example, not a description of a particular bank or a live Sentinel deployment.

The reviewer notices the gap: successful backup jobs do not, by themselves, establish that a restoration was tested successfully. The agent has converted evidence of one activity into assurance about a different outcome. That logical error matters even when the writing is polished and every cited document exists.

The assigned reviewer should withhold the unsupported conclusion. The Agent Manager has a separate responsibility: determine whether this is an isolated case or a recurring behavior, stop the affected output path where necessary, and work with engineering to correct it. The final control conclusion remains with the designated decision-maker.

I would then add this failure to the evaluation set, establish what evidence is required for recovery claims, and test similar cases before restoring the affected capability. Merely correcting the paragraph would fix the document while leaving the behavior unchanged.

That is the difference between reviewing an output and managing the system that produced it.

## Measure the work, the controls, and the human burden

AgentOps gives the management role an operating discipline: continuing evaluation of the deployed system, attention to changing behavior, and an explicit owner for reviewing the dashboard. [1] I would turn that into a compact scorecard rather than a wall of activity statistics:

| Question | Evidence I would review |
| --- | --- |
| Is the work acceptable? | Correctness, source support, and material omissions in a reviewed sample, including cases the agent did not flag. |
| Did the agent stay within authority? | Prevented attempts reported separately from actions that actually exceeded authorization. |
| Are escalations effective? | Missed and unnecessary escalations, response time, and unresolved queue age. |
| Is the workflow creating value? | Cost per accepted result, including review, correction, support, and operating costs, compared with the existing process. |
| Did a change make the system worse? | Before-and-after test results for material changes to models, instructions, tools, data sources, or permissions. |

I would avoid treating fewer escalations as an automatic improvement. The agent may have become better at its job, or it may have stopped recognizing uncertainty. Reviewing unflagged work is how a manager begins to distinguish those possibilities. Likewise, a blocked unauthorized request is evidence of a prevented action, not proof that an unauthorized action occurred.

The scorecard needs decision rules. For the illustrative risk workflow, an unsupported consequential conclusion would hold the affected package for review. An actual unauthorized write would trigger an incident response and a pause of the relevant capability. A rise in minor corrections might instead trigger targeted testing. These are proposed operating rules, not universal regulatory thresholds.

The manager should also require a controlled feedback process. A discovered problem becomes a reviewed change, a test, and a recorded deployment decision. Feedback should not silently widen permissions or rewrite policy.

## Give the manager time and real intervention rights

Here is a hypothetical capacity calculation: 1,000 tasks a day, a 5% escalation rate, and six minutes to resolve each escalation produce five staff-hours of exception work. That is before sampling unflagged cases, investigating failures, reviewing changes, or meeting with engineering. These assumptions illustrate workload; they are not a recommended staffing ratio.

The implication is practical. Do not assign agent management as an invisible second job and then count all the apparent automation savings as capacity gained. Determine what existing work will be removed, how coverage works when the manager is unavailable, and what happens when the review queue exceeds capacity.

I would give the manager tested authority to pause a capability, narrow its scope, and invoke an approved fallback. Restarting after a serious failure should require evidence and the appropriate approval. Expanding permissions should sit with the designated authority, not happen through an improvised operational workaround.

A stop button is not a recovery plan. Stopping an agent prevents further execution; it does not necessarily undo an email already sent or a record already changed. The operating procedure should specify what can be reversed, what requires corrective action, how evidence is preserved, and how work continues safely.

## Keep management distinct from independent challenge

For a business-line workflow, my recommendation is to place day-to-day agent management with the function that understands and owns the work. Engineering should own technical implementation and reliability; security should support identity and access controls; independent reviewers should challenge whether the evidence supports deployment and continued use.

A second-line risk team may manage an agent that supports its own review work. That does not make the team an independent validator of the same system, nor should it transfer ownership of business-line controls to second line. Name the responsibilities separately, even when a small pilot requires individuals to wear more than one operational hat.

NIST's voluntary AI Risk Management Framework supports the underlying discipline: documented responsibilities, differentiated human-AI oversight, and mechanisms to intervene when a system's behavior is inconsistent with its intended use. It also includes post-deployment monitoring and change management. It does not prescribe the particular job title used here. [5]

## A practical starting point

For an initial pilot, I would select one bounded workflow and name a manager and backup before connecting live systems. I would establish a baseline for quality, turnaround time, review effort, and cost, then test normal cases alongside missing evidence, conflicting information, failed tools, and attempted out-of-scope actions.

Next, I would run in shadow mode, without letting the agent's outputs change the real process, and compare results with qualified human review. Promotion should depend on agreed acceptance criteria and evidence appropriate to the consequences, not an arbitrary number of successful examples. The first live stage should preserve human decision gates and include a practiced stop-and-recovery exercise.

Before expanding, ask the manager to demonstrate three things: how to recognize an unacceptable result, how to prevent the next consequential action, and what evidence would justify restarting. A person who can only show a green dashboard is not yet equipped to supervise the workflow.

My bottom line is that the Agent Manager role should turn oversight into operating decisions. The valuable skill is not simply getting software to do more. It is knowing what to delegate, what evidence to demand, and when the work must return to a person.

*Independent commentary informed by coursework and public sources. This is not MIT course material or an MIT-endorsed framework. The operating practices and hypothetical examples are the author's recommendations, not claims about controls verified in production.*

## Sources

[1] MIT Sloan and MIT Schwarzman College of Computing, Implementing Agentic AI: Your Organizational Playbook. Course file “MIT AGAI Playbook(1).docx,” Module 2, sections 2.1, 2.3, 2.5, and 2.6. Section 2.5 attributes its manager framing to Kanchana Patlolla, Module 2 Unit 2. Private course source; summarized, not reproduced.

[2] BNY, “Unlocking Value with BNY’s Enterprise AI Platform,” October 20, 2025. Company-reported deployment with credentials and supervisors; not independent control validation. [Read source](https://www.bny.com/corporate/global/en/insights/unlocking-potential-enterprise-ai-platform-bny.html)

[3] Anthropic, “How we built our multi-agent research system,” June 13, 2025. First-party account of lead-agent coordination and human evaluation. [Read source](https://www.anthropic.com/engineering/multi-agent-research-system)

[4] Microsoft, “The 2025 Annual Work Trend Index: The Frontier Firm is born,” April 23, 2025. Workforce research and the company’s “agent boss” framing; not evidence of universal role adoption. [Read source](https://blogs.microsoft.com/blog/2025/04/23/the-2025-annual-work-trend-index-the-frontier-firm-is-born/)

[5] NIST, AI Risk Management Framework 1.0, AI RMF Core. Particularly GOVERN 2.1 and 3.2 and MANAGE 2.4 and 4.1. Voluntary framework; it does not mandate an Agent Manager job title. Sources checked September 12, 2026. [Read source](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)
