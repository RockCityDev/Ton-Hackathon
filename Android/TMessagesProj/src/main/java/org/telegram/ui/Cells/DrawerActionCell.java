/*
 * This is the source code of Telegram for Android v. 5.x.x.
 * It is licensed under GNU GPL v. 2 or later.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Nikolai Kudashov, 2013-2018.
 */

package org.telegram.ui.Cells;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffColorFilter;
import android.graphics.RectF;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import com.ruffian.library.widget.RView;

import org.telegram.messenger.AndroidUtilities;
import org.telegram.messenger.FileLog;
import org.telegram.messenger.LocaleController;
import org.telegram.messenger.MessagesController;
import org.telegram.messenger.R;
import org.telegram.messenger.UserConfig;
import org.telegram.ui.ActionBar.Theme;
import org.telegram.ui.Components.AnimatedTextView;
import org.telegram.ui.Components.CubicBezierInterpolator;
import org.telegram.ui.Components.LayoutHelper;
import org.telegram.ui.Components.RLottieImageView;

import java.util.Set;

import timber.log.Timber;

public class DrawerActionCell extends FrameLayout {

    // 自定义START
    private RView bgView;
    private RView shadeView;
    // 自定义END

    private ImageView imageView;
    private RLottieImageView lottieImageView;
    private AnimatedTextView textView;
    private int currentId;
    private RectF rect = new RectF();
    private int currentLottieId;

    public DrawerActionCell(Context context) {
        super(context);

        bgView = new RView(context);
        bgView.setVisibility(INVISIBLE);
        bgView.getHelper().setCornerRadius(AndroidUtilities.dp(8));
        addView(bgView, LayoutHelper.createFrame(30, 30, Gravity.LEFT | Gravity.TOP, 17, 9, 0, 0));

        shadeView = new RView(context);
        shadeView.setVisibility(INVISIBLE);
        shadeView.getHelper()
                .setBackgroundColorNormal(Color.parseColor("#4D000000"))
                .setCornerRadius(AndroidUtilities.dp(8));
        addView(shadeView, LayoutHelper.createFrame(30, 30, Gravity.LEFT | Gravity.TOP, 17, 9, 0, 0));

        imageView = new ImageView(context);
        addView(imageView, LayoutHelper.createFrame(24, 24, Gravity.LEFT | Gravity.TOP, 20, 12, 0, 0));

        lottieImageView = new RLottieImageView(context);
        lottieImageView.setAutoRepeat(false);
        lottieImageView.setColorFilter(new PorterDuffColorFilter(Theme.getColor(Theme.key_chats_menuItemIcon), PorterDuff.Mode.SRC_IN));
        addView(lottieImageView, LayoutHelper.createFrame(28, 28, Gravity.LEFT | Gravity.TOP, 17, 10, 0, 0));

        textView = new AnimatedTextView(context, true, true, true);
        textView.setAnimationProperties(.6f, 0, 350, CubicBezierInterpolator.EASE_OUT_QUINT);
        textView.setTextColor(Theme.getColor(Theme.key_chats_menuItemText));
        textView.setTextSize(AndroidUtilities.dp(15));
        textView.setTypeface(AndroidUtilities.getTypeface("fonts/rmedium.ttf"));
        addView(textView, LayoutHelper.createFrame(LayoutHelper.MATCH_PARENT, LayoutHelper.MATCH_PARENT, Gravity.LEFT | Gravity.TOP, 19 + 24 + 29, 0, 16, 0));

        setWillNotDraw(false);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        if (currentId == 8) {
            Set<String> suggestions = MessagesController.getInstance(UserConfig.selectedAccount).pendingSuggestions;
            if (suggestions.contains("VALIDATE_PHONE_NUMBER") || suggestions.contains("VALIDATE_PASSWORD")) {
                int countTop = AndroidUtilities.dp(12.5f);
                int countWidth = AndroidUtilities.dp(9);
                int countLeft = getMeasuredWidth() - countWidth - AndroidUtilities.dp(25);

                int x = countLeft - AndroidUtilities.dp(5.5f);
                rect.set(x, countTop, x + countWidth + AndroidUtilities.dp(14), countTop + AndroidUtilities.dp(23));
                Theme.chat_docBackPaint.setColor(Theme.getColor(Theme.key_chats_archiveBackground));
                canvas.drawRoundRect(rect, 11.5f * AndroidUtilities.density, 11.5f * AndroidUtilities.density, Theme.chat_docBackPaint);

                int w = Theme.dialogs_errorDrawable.getIntrinsicWidth();
                int h = Theme.dialogs_errorDrawable.getIntrinsicHeight();
                Theme.dialogs_errorDrawable.setBounds((int) (rect.centerX() - w / 2), (int) (rect.centerY() - h / 2), (int) (rect.centerX() + w / 2), (int) (rect.centerY() + h / 2));
                Theme.dialogs_errorDrawable.draw(canvas);
            }
        }
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(MeasureSpec.makeMeasureSpec(MeasureSpec.getSize(widthMeasureSpec), MeasureSpec.EXACTLY), MeasureSpec.makeMeasureSpec(AndroidUtilities.dp(48), MeasureSpec.EXACTLY));
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        textView.setTextColor(Theme.getColor(Theme.key_chats_menuItemText));
    }

    public void setTextAndIcon(int id, String text, int resId, int lottieId, int color, int[] colors,boolean bigIcon) {
        currentId = id;
        try {
            textView.setText(text, false);
            if (lottieId != 0) {
                imageView.setImageDrawable(null);
                lottieImageView.setAnimation(currentLottieId = lottieId, 28, 28);
            } else {
                Drawable drawable = getResources().getDrawable(resId).mutate();
                if (drawable != null) {
                    drawable.setColorFilter(new PorterDuffColorFilter(Theme.getColor(Theme.key_chats_menuItemIcon), PorterDuff.Mode.MULTIPLY));
                }
                imageView.setImageDrawable(drawable);
                lottieImageView.clearAnimationDrawable();
                currentLottieId = 0;

                if (color != 0 || colors != null) {
                    if (drawable != null) {
                        drawable.setColorFilter(new PorterDuffColorFilter(Color.WHITE, PorterDuff.Mode.MULTIPLY));
                    }
                    bgView.setVisibility(VISIBLE);
                    if (color == -1) {
                        bgView.getHelper().setBackgroundDrawableNormal(getResources().getDrawable(R.drawable.edit_nft_photo_drawer_bg));
                    } else if (Theme.getCurrentTheme().isDark()) {
                        bgView.getHelper().setBackgroundColorNormal(Theme.getColor(Theme.key_chats_unreadCounter));
                    } else if (color != 0) {
                        bgView.getHelper().setBackgroundColorNormal(color);
                    } else {
                        bgView.getHelper()
                                .setGradientOrientation(GradientDrawable.Orientation.LEFT_RIGHT)
                                .setBackgroundColorNormalArray(colors);
                    }
                    if (text.equals(LocaleController.getString("stealth_menu_title_on", R.string.stealth_menu_title_on))) {
                        shadeView.setVisibility(VISIBLE);
                    } else {
                        shadeView.setVisibility(INVISIBLE);
                    }
                } else if (bigIcon) {
                    bgView.setVisibility(INVISIBLE);
                    shadeView.setVisibility(INVISIBLE);
                    drawable.setColorFilter(null);
                    FrameLayout.LayoutParams bigParams = (FrameLayout.LayoutParams) bgView.getLayoutParams();
                    imageView.setLayoutParams(bigParams);
                } else {
                    bgView.setVisibility(INVISIBLE);
                    shadeView.setVisibility(INVISIBLE);
                }
            }
        } catch (Throwable e) {
            FileLog.e(e);
        }
    }

    public void updateText(String text) {
        textView.setText(text);
    }

    public void updateIcon(int lottieId) {
        try {
            if (lottieId != currentLottieId) {
                lottieImageView.setOnAnimationEndListener(() -> {
                    lottieImageView.setAnimation(currentLottieId = lottieId, 28, 28);
                    lottieImageView.setOnAnimationEndListener(null);
                });
                lottieImageView.playAnimation();
            }
        } catch (Throwable e) {
            FileLog.e(e);
        }
    }

    @Override
    public void onInitializeAccessibilityNodeInfo(AccessibilityNodeInfo info) {
        super.onInitializeAccessibilityNodeInfo(info);
        info.addAction(AccessibilityNodeInfo.ACTION_CLICK);
        info.addAction(AccessibilityNodeInfo.ACTION_LONG_CLICK);
        info.setText(textView.getText());
        info.setClassName(TextView.class.getName());
    }
}
