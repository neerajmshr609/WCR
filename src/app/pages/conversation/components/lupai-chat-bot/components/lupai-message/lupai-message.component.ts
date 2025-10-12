import {
  Component,
  input,
  signal,
  computed,
  ChangeDetectionStrategy,
  output,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ConversationMessage } from '../../../../../../store/lupai-chat/lupai-chat.store';
import { STAGE_DISPLAY_MESSAGES } from '../../../../../../store/lupai-chat/lupai-response.types';
import { getRandomAvatarSrc } from '../../../../../usersettings/constants/avatars';

@Component({
  selector: 'app-lupai-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lupai-message.component.html',
  styleUrls: ['./lupai-message.component.scss'],
  imports: [
    NgClass,
    MatIcon,
    MatProgressBar,
    MatChipsModule,
    MatCardModule,
    MatExpansionModule,
    TranslateModule,
  ],
})
export class LupaiMessageComponent {
  // Input message
  readonly message = input.required<ConversationMessage>();

  // Output events
  readonly topicClicked = output<string>();

  // UI state
  public expandedSources = signal(false);
  public expandedOrganizations = signal(false);

  // Computed properties
  public readonly isUserMessage = computed(
    () => this.message().sender === 'user',
  );
  public readonly isLupaiMessage = computed(
    () => this.message().sender === 'lupai',
  );
  public readonly isProcessing = computed(
    () => this.message().isProcessing || false,
  );
  public readonly hasError = computed(() => !!this.message().error);
  public readonly hasSensitiveTopic = computed(
    () => !!this.message().sensitiveTopic,
  );
  public readonly hasImprovedQuery = computed(
    () => !!this.message().improvedQuery,
  );
  public readonly hasSources = computed(
    () =>
      this.message().retrieverItems &&
      this.message().retrieverItems!.length > 0,
  );
  public readonly hasOrganizations = computed(
    () =>
      this.message().organizations && this.message().organizations!.length > 0,
  );
  public readonly hasTopics = computed(
    () => this.message().topics && this.message().topics!.length > 0,
  );
  public readonly hasUserContext = computed(
    () => this.isUserMessage() && !!this.message().userContext,
  );
  public readonly hasUserLocation = computed(
    () => this.isUserMessage() && !!this.message().userLocation,
  );

  // Processing stage information
  public readonly currentStageDisplay = computed(() => {
    const stage = this.message().currentStage;
    return stage ? STAGE_DISPLAY_MESSAGES[stage] : null;
  });

  public readonly stageProgress = computed(
    () => this.message().stageProgress || 0,
  );

  // Formatted content computed property
  public readonly formattedContent = computed((): SafeHtml => {
    const content = this.message().content;
    if (!content) return '';
    return this.sanitizer.bypassSecurityTrustHtml(
      this.formatResponseContent(content),
    );
  });

  // Avatar source computed property for user messages
  readonly avatarSrc = computed(() => {
    const message = this.message();
    // For user messages, use user avatar or generate random one based on message id
    if (this.isUserMessage()) {
      // Generate a simple numeric hash from message id for consistent avatar
      const idHash = message.id
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return (message as any)?.user?.image || getRandomAvatarSrc(idHash);
    }
    // For lupai messages, use robot.svg
    return 'assets/conversations/robot.svg';
  });

  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Checks if the content is a translation key (e.g., for welcome or info messages)
   */
  public isTranslationKey(content: string): boolean {
    return typeof content === 'string' && content.startsWith('lupai_chatbot.');
  }

  /**
   * Format response content with proper HTML structure
   * Handles numbered lists, paragraphs, and bold text
   */
  private formatResponseContent(content: string): string {
    if (!content) return '';

    // Split by double newlines to identify paragraphs
    const paragraphs = content.split('\n\n').filter((p) => p.trim());

    return paragraphs
      .map((paragraph) => {
        const trimmed = paragraph.trim();

        // Check if paragraph starts with a number (numbered list item)
        const numberedMatch = trimmed.match(/^(\d+)\.\s*(.+)/s);
        if (numberedMatch) {
          return this.formatNumberedListItem(
            numberedMatch[1],
            numberedMatch[2],
          );
        }

        // Regular paragraph
        return `<p class="lupai-paragraph">${this.formatInlineContent(trimmed)}</p>`;
      })
      .join('');
  }

  /**
   * Format a numbered list item with proper styling
   */
  private formatNumberedListItem(number: string, content: string): string {
    const formattedContent = this.formatInlineContent(content);
    return `
            <div class="lupai-numbered-item">
                <div class="lupai-numbered-item__number">${number}.</div>
                <div class="lupai-numbered-item__content">${formattedContent}</div>
            </div>
        `;
  }

  /**
   * Format inline content (bold text, line breaks)
   */
  private formatInlineContent(content: string): string {
    return (
      content
        // Convert colon-prefixed text to bold (e.g., "Find a certified translator: description")
        .replace(/^([^:]+):\s*(.+)/gm, '<strong>$1:</strong> $2')
        // Convert single newlines to line breaks
        .replace(/\n/g, '<br>')
    );
  }

  // Format relative score as percentage
  public formatRelevanceScore(score: number): string {
    return `${Math.round(score * 100)}%`;
  }

  // Format organization match score
  public formatMatchScore(score: number): string {
    return `${Math.round(score * 100)}% match`;
  }

  // Toggle sources expansion
  public toggleSources(): void {
    this.expandedSources.update((expanded) => !expanded);
  }

  // Toggle organizations expansion
  public toggleOrganizations(): void {
    this.expandedOrganizations.update((expanded) => !expanded);
  }

  // Open external link safely
  public openLink(url: string): void {
    if (url && this.isValidUrl(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  // Validate URL
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Get formatted timestamp
  public getFormattedTime(): string {
    return new Date(this.message().timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Get domain-specific styling
  public getDomainStyling(): string {
    const domain = this.message().domain?.domain;
    switch (domain) {
      case 'Immigration':
        return 'domain-immigration';
      case 'Asylum':
        return 'domain-asylum';
      default:
        return 'domain-general';
    }
  }

  // Get intent-specific icon
  public getIntentIcon(): string {
    const intent = this.message().intent;
    switch (intent) {
      case 'Perform acction':
        return 'assignment';
      case 'Validate information':
        return 'help_outline';
      default:
        return 'chat';
    }
  }

  // Handle topic click
  public onTopicClick(topic: string): void {
    console.log('🏷️ Topic clicked:', topic);
    this.topicClicked.emit(topic);
  }

  // Get user context display label for country
  public getCountryLabel(countryValue: string): string {
    const countries = [
      { value: 'ukraine', label: 'user_context_form.countries.ukraine' },
      { value: 'syria', label: 'user_context_form.countries.syria' },
      {
        value: 'afghanistan',
        label: 'user_context_form.countries.afghanistan',
      },
      { value: 'turkey', label: 'user_context_form.countries.turkey' },
      { value: 'poland', label: 'user_context_form.countries.poland' },
      { value: 'romania', label: 'user_context_form.countries.romania' },
      { value: 'other', label: 'user_context_form.countries.other' },
    ];

    const country = countries.find((c) => c.value === countryValue);
    return country ? country.label : countryValue;
  }

  // Get user context display label for time in Germany
  public getTimeInGermanyLabel(timeValue: string): string {
    const timeOptions = [
      {
        value: 'not_living',
        label: 'user_context_form.time_in_germany.not_living',
      },
      { value: 'tourist', label: 'user_context_form.time_in_germany.tourist' },
      {
        value: '0-1 year',
        label: 'user_context_form.time_in_germany.0_1_year',
      },
      {
        value: '1-5 years',
        label: 'user_context_form.time_in_germany.1_5_years',
      },
      {
        value: '+5 years',
        label: 'user_context_form.time_in_germany.5_plus_years',
      },
    ];

    const timeOption = timeOptions.find((t) => t.value === timeValue);
    return timeOption ? timeOption.label : timeValue;
  }

  // Get user context display label for age
  public getAgeLabel(ageValue: string): string {
    const ageOptions = [
      { value: '18-25', label: 'user_context_form.age_options.18_25' },
      { value: '26-35', label: 'user_context_form.age_options.26_35' },
      { value: '36-45', label: 'user_context_form.age_options.36_45' },
      { value: '46-55', label: 'user_context_form.age_options.46_55' },
      { value: '55+', label: 'user_context_form.age_options.55_plus' },
      {
        value: 'unspecified',
        label: 'user_context_form.age_options.unspecified',
      },
    ];

    const ageOption = ageOptions.find((a) => a.value === ageValue);
    return ageOption ? ageOption.label : ageValue;
  }

  getAllClasses(): string {
    const classes = ['lupai-message'];
    if (this.isUserMessage()) classes.push('lupai-message--user');
    if (this.isLupaiMessage()) classes.push('lupai-message--lupai');
    if (this.isProcessing()) classes.push('lupai-message--processing');
    if (this.hasError()) classes.push('lupai-message--error');
    classes.push(this.getDomainStyling());
    return classes.join(' ');
  }
}
