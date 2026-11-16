export const initialState = { ready: false, commits: {}, branches: {}, head: 'main', n: 0 };

const fail = (state, explain) => ({ state, explain, error: true });

function isAncestor(commits, a, b) { // is commit a reachable from commit b?
  const stack = [b], seen = new Set();
  while (stack.length) {
    const x = stack.pop();
    if (x === a) return true;
    if (seen.has(x)) continue;
    seen.add(x);
    stack.push(...commits[x].parents);
  }
  return false;
}

export function run(state, input) {
  const parts = input.trim().split(/\s+/);
  if (parts[0] === 'git') parts.shift();
  const [cmd, ...args] = parts;
  if (!cmd) return fail(state, 'Type a command.');

  if (cmd === 'init') {
    if (state.ready) return fail(state, 'A repository already exists here.');
    return { state: { ...initialState, ready: true }, explain: 'Created an empty repository. You are on branch "main" with no commits yet.' };
  }
  if (!state.ready) return fail(state, 'Run "init" first to create a repository.');

  const tip = state.branches[state.head];

  if (cmd === 'commit') {
    const i = args.indexOf('-m');
    const message = (i >= 0 ? args.slice(i + 1).join(' ').replace(/["']/g, '') : '') || 'update';
    const id = 'c' + (state.n + 1);
    return {
      state: {
        ...state, n: state.n + 1,
        commits: { ...state.commits, [id]: { id, parents: tip ? [tip] : [], message, branch: state.head } },
        branches: { ...state.branches, [state.head]: id },
      },
      explain: `Saved a snapshot as ${id}. The branch "${state.head}" now points to it, and it remembers its parent${tip ? ' ' + tip : ' (none, this is the first commit)'}.`,
    };
  }

  if (cmd === 'branch') {
    const name = args[0];
    if (!name) return fail(state, 'Give the branch a name, e.g. branch feature.');
    if (!tip) return fail(state, 'Make at least one commit before creating a branch.');
    if (state.branches[name]) return fail(state, `Branch "${name}" already exists.`);
    return { state: { ...state, branches: { ...state.branches, [name]: tip } }, explain: `Created branch "${name}" pointing at ${tip}. A branch is just a movable label on a commit. You are still on "${state.head}".` };
  }

  if (cmd === 'checkout') {
    const create = args[0] === '-b';
    const name = create ? args[1] : args[0];
    if (!name) return fail(state, 'Which branch? e.g. checkout feature.');
    if (create) {
      if (!tip) return fail(state, 'Make at least one commit first.');
      if (state.branches[name]) return fail(state, `Branch "${name}" already exists.`);
      return { state: { ...state, head: name, branches: { ...state.branches, [name]: tip } }, explain: `Created branch "${name}" and switched to it. New commits will now go on "${name}".` };
    }
    if (!state.branches[name]) return fail(state, `Branch "${name}" does not exist.`);
    return { state: { ...state, head: name }, explain: `Switched to "${name}". HEAD now points to this branch, so new commits will be added here.` };
  }

  if (cmd === 'merge') {
    const name = args[0];
    const target = state.branches[name];
    if (!name || !target) return fail(state, `Branch "${name}" does not exist.`);
    if (name === state.head) return fail(state, 'You cannot merge a branch into itself.');
    if (!tip || isAncestor(state.commits, target, tip)) return fail(state, 'Already up to date. Nothing to merge.');
    if (isAncestor(state.commits, tip, target)) {
      return { state: { ...state, branches: { ...state.branches, [state.head]: target } }, explain: `Fast-forward: "${state.head}" had no new work of its own, so its label just moved forward to ${target}. No new commit was needed.` };
    }
    const id = 'c' + (state.n + 1);
    return {
      state: {
        ...state, n: state.n + 1,
        commits: { ...state.commits, [id]: { id, parents: [tip, target], message: `Merge ${name} into ${state.head}`, branch: state.head } },
        branches: { ...state.branches, [state.head]: id },
      },
      explain: `Both branches had new work, so Git created a merge commit ${id} with two parents (${tip} and ${target}) to join the histories.`,
    };
  }

  return fail(state, `Unknown command "${cmd}". Try: init, commit -m "msg", branch, checkout, merge.`);
}
