/**
 * Native Share Service for NativeScript
 *
 * Provides native share sheet functionality for sharing friend invite links.
 * Uses NativeScript's native APIs for iOS UIActivityViewController
 * and Android Intent.ACTION_SEND.
 *
 * @example
 * ```typescript
 * import { shareService } from '@/services/share';
 *
 * await shareService.shareInviteLink('user-123');
 * await shareService.shareText('Check out Happy!', 'https://happy.engineering');
 * ```
 */

import { isIOS, isAndroid, Utils } from '@nativescript/core';

/**
 * Share result indicating user action
 */
export interface ShareResult {
  success: boolean;
  activityType?: string;
}

/**
 * Share Service Implementation
 */
class ShareServiceImpl {
  /**
   * Share a URL with optional text
   */
  async shareUrl(url: string, text?: string): Promise<ShareResult> {
    try {
      if (isIOS) {
        return await this.shareIOS([text, url].filter(Boolean));
      } else if (isAndroid) {
        return await this.shareAndroid(text ?? '', url);
      }
      return { success: false };
    } catch (error) {
      console.error('[ShareService] Share failed:', error);
      return { success: false };
    }
  }

  /**
   * Share text only
   */
  async shareText(text: string): Promise<ShareResult> {
    try {
      if (isIOS) {
        return await this.shareIOS([text]);
      } else if (isAndroid) {
        return await this.shareAndroid(text);
      }
      return { success: false };
    } catch (error) {
      console.error('[ShareService] Share failed:', error);
      return { success: false };
    }
  }

  /**
   * Share a friend invite link
   */
  async shareInviteLink(userId: string): Promise<ShareResult> {
    const url = `https://happy.engineering/friend/add/${userId}`;
    const text = 'Add me on Happy!';
    return this.shareUrl(url, text);
  }

  /**
   * iOS share using UIActivityViewController
   */
  private async shareIOS(items: (string | undefined)[]): Promise<ShareResult> {
    return new Promise((resolve) => {
      const validItems = items.filter((item): item is string => !!item);

      // Create NSArray of items
      const nsItems = NSMutableArray.alloc().init();
      for (const item of validItems) {
        if (item.startsWith('http://') || item.startsWith('https://')) {
          nsItems.addObject(NSURL.URLWithString(item));
        } else {
          nsItems.addObject(item);
        }
      }

      // Create UIActivityViewController
      const activityController = UIActivityViewController.alloc()
        .initWithActivityItemsApplicationActivities(nsItems, undefined as unknown as NSArray<UIActivity>);

      // Get the root view controller
      const app = UIApplication.sharedApplication;
      const rootController = app.keyWindow?.rootViewController;

      if (!rootController) {
        resolve({ success: false });
        return;
      }

      // Set completion handler
      activityController.completionWithItemsHandler = (
        activityType: string | null,
        completed: boolean
      ) => {
        resolve({
          success: completed,
          activityType: activityType ?? undefined,
        });
      };

      // Present the share sheet
      // For iPad, we need to set the popover presentation controller
      if (activityController.popoverPresentationController) {
        activityController.popoverPresentationController.sourceView = rootController.view;
        activityController.popoverPresentationController.sourceRect = CGRectMake(
          rootController.view.bounds.size.width / 2,
          rootController.view.bounds.size.height / 2,
          0,
          0
        );
      }

      rootController.presentViewControllerAnimatedCompletion(
        activityController,
        true,
        () => { /* completion handler */ }
      );
    });
  }

  /**
   * Android share using Intent.ACTION_SEND
   */
  private async shareAndroid(text: string, url?: string): Promise<ShareResult> {
    return new Promise((resolve) => {
      try {
        const context = Utils.android.getApplicationContext();
        const Intent = android.content.Intent;

        const sendIntent = new Intent(Intent.ACTION_SEND);
        sendIntent.setType('text/plain');

        // Combine text and URL
        const shareText = url ? `${text}\n${url}` : text;
        sendIntent.putExtra(Intent.EXTRA_TEXT, shareText);

        // Create chooser
        const chooserIntent = Intent.createChooser(sendIntent, 'Share via');
        chooserIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        // Start activity
        context.startActivity(chooserIntent);

        // Android doesn't provide completion callback, assume success
        resolve({ success: true });
      } catch (error) {
        console.error('[ShareService] Android share failed:', error);
        resolve({ success: false });
      }
    });
  }
}

/**
 * Singleton share service instance
 */
export const shareService = new ShareServiceImpl();
