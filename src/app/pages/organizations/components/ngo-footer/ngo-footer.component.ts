import { Component, signal } from '@angular/core';

export interface INgoFooterLink {
  id?: number;
  link_text?: string;
  url?: string;
}
@Component({
  selector: 'app-ngo-footer',
  templateUrl: './ngo-footer.component.html',
  styleUrls: ['./ngo-footer.component.scss'],
})
export class NgoFooterComponent {
  trendingBlogposts = signal<INgoFooterLink[]>([
    {
      id: 1,
      link_text: 'footer.blogposts.item-1',
      url: '#',
    },
    {
      id: 2,
      link_text: 'footer.blogposts.item-2',
      url: '#',
    },
    {
      id: 3,
      link_text: 'footer.blogposts.item-3',
      url: '#',
    },
    {
      id: 4,
      link_text: 'footer.blogposts.item-4',
      url: '#',
    },
    {
      id: 5,
      link_text: 'footer.blogposts.item-5',
      url: '#',
    },
    {
      id: 6,
      link_text: 'footer.blogposts.item-6',
      url: '#',
    },
    {
      id: 7,
      link_text: 'footer.blogposts.item-7',
      url: '#',
    },
  ]);
  blogTopics = signal<INgoFooterLink[]>([
    {
      id: 1,
      link_text: 'footer.blog.item-1',
      url: '#',
    },
    {
      id: 2,
      link_text: 'footer.blog.item-2',
      url: '#',
    },
    {
      id: 3,
      link_text: 'footer.blog.item-3',
      url: '#',
    },
    {
      id: 4,
      link_text: 'footer.blog.item-4',
      url: '#',
    },
    {
      id: 5,
      link_text: 'footer.blog.item-5',
      url: '#',
    },
    {
      id: 6,
      link_text: 'footer.blog.item-6',
      url: '#',
    },
    {
      id: 7,
      link_text: 'footer.blog.item-7',
      url: '#',
    },
  ]);
  team = signal<INgoFooterLink[]>([
    {
      id: 1,
      link_text: 'Anna Mog',
      url: '#',
    },
    {
      id: 2,
      link_text: 'Frank Gerhardt',
      url: '#',
    },
    {
      id: 3,
      link_text: 'Zhanna Z.',
      url: '#',
    },
    {
      id: 4,
      link_text: 'Natalia Uvarova.',
      url: '#',
    },
    {
      id: 5,
      link_text: 'Warwara Pot.',
      url: '#',
    },
    {
      id: 6,
      link_text: 'footer.team-and-other.item-1',
      url: '#',
    },
    {
      id: 7,
      link_text: 'footer.team-and-other.privacy-policy',
      url: '/policy',
    },
  ]);
}
