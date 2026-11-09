import { ensureOneParticipant } from '../../helpers/participants';

describe('Chat panel', () => {
    it('join participant', () => ensureOneParticipant());

    it('start closed', async () => {
        expect(await ctx.p1.getChatPanel().isOpen()).toBe(false);
    });
    it('open', async () => {
        const { p1 } = ctx;

        await p1.getToolbar().clickChatButton();
        expect(await p1.getChatPanel().isOpen()).toBe(true);
    });
    it('use shortcut to close', async () => {
        const chatPanel = ctx.p1.getChatPanel();

        await chatPanel.pressShortcut();
        expect(await chatPanel.isOpen()).toBe(false);
    });
    it('use shortcut to open', async () => {
        const chatPanel = ctx.p1.getChatPanel();

        await chatPanel.pressShortcut();
        expect(await chatPanel.isOpen()).toBe(true);
    });
    it('exposes accessible names and keyboard access', async () => {
        const { p1 } = ctx;

        const result = await p1.execute(() => {
            const log = document.getElementById('chatconversation');
            const labelId = log?.getAttribute('aria-labelledby');
            const emojiToggle = document.querySelector('#chat-input [role="button"][aria-expanded]');
            const positiveTabIndexes = Array.from(document.querySelectorAll('#sideToolbarContainer [tabindex]'))
                .filter(element => Number(element.getAttribute('tabindex')) > 0).length;

            return {
                labelResolves: Boolean(labelId && document.getElementById(labelId)),
                emojiToggleLabel: emojiToggle?.getAttribute('aria-label') ?? null,
                emojiToggleExpanded: emojiToggle?.getAttribute('aria-expanded') ?? null,
                positiveTabIndexes
            };
        });

        // The message log is labelled by an element that exists.
        expect(result.labelResolves).toBe(true);

        // The emoji toggle has a name and tells whether the panel is open (it is closed at this point).
        expect(result.emojiToggleLabel).toBeTruthy();
        expect(result.emojiToggleExpanded).toBe('false');

        // Nothing in the side panel jumps ahead of the page in the tab order.
        expect(result.positiveTabIndexes).toBe(0);
    });
    it('use button to close', async () => {
        const { p1 } = ctx;

        await p1.getToolbar().clickCloseChatButton();
        expect(await p1.getChatPanel().isOpen()).toBe(false);
    });
});
