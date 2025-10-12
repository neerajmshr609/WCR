import { ClientForms } from '../interfaces';
import { ORGANIZATION_STATUSES } from './statuses';
import { CountriesItems } from './countriesitem';

export const FORMS: ClientForms = {
  client: {
    uploadAvatarLabel: 'select_avatar',
    selectedAvatarLabel: 'choose_avatar',
    role: 'client',
    inputs: [
      {
        label: 'firstname_input.title',
        placeholder: 'firstname_input.placeholder',
        name: 'first_name',
        type: 'text',
      },
      {
        label: 'lastname_input.title',
        placeholder: 'lastname_input.placeholder',
        name: 'last_name',
        type: 'text',
      },
      {
        label: 'username_input.title',
        placeholder: 'username_input.placeholder',
        name: 'name',
        type: 'text',
      },
      {
        label: 'email_input.title',
        placeholder: 'email_input.placeholder',
        name: 'email',
        type: 'email',
      },

      {
        label: 'phone_number_input.title',
        placeholder: 'phone_number_input.placeholder',
        name: 'phone_number',
        type: 'number',
      },
      {
        label: 'country_input.title',
        placeholder: 'country_input.placeholder',
        name: 'country',
        type: 'select',
        options: CountriesItems,
        viewModel: ['code', 'name'],
      },
      {
        label: 'city_input.title',
        placeholder: 'city_input.placeholder',
        name: 'city',
        type: 'text',
      },
      {
        label: 'zipCode_input.title',
        placeholder: 'zipCode_input.placeholder',
        name: 'postal_code',
        type: 'number',
      },
    ],
    avatars: [
      `/assets/avatars/smile_1.svg`,
      `/assets/avatars/smile_2.svg`,
      `/assets/avatars/smile_3.svg`,
      `/assets/avatars/smile_4.svg`,
      `/assets/avatars/smile_5.svg`,
      `/assets/avatars/smile_6.svg`,
      `/assets/avatars/smile_7.svg`,
      `/assets/avatars/smile_8.svg`,
    ],
    hasReset: true,
  },
  organization: {
    uploadAvatarLabel: 'upload_avatar_ngo',
    selectedAvatarLabel: 'choose_avatar',
    role: 'organization',
    inputs: [
      {
        label: 'ngo_nickname_input.title',
        placeholder: 'ngo_nickname_input.placeholder',
        name: 'short_name',
        type: 'text',
      },
      {
        label: 'ngo_name_input.title',
        placeholder: 'ngo_name_input.placeholder',
        name: 'legal_name',
        type: 'text',
      },
      {
        label: 'ngo_handle_input.title',
        placeholder: 'ngo_handle_input.placeholder',
        name: 'org_handle',
        type: 'text',
      },
      {
        label: 'ngo_email_input.title',
        placeholder: 'ngo_email_input.placeholder',
        name: 'email',
        type: 'email',
      },
      {
        label: 'street_input.title',
        placeholder: 'street_input.placeholder',
        name: 'street',
        type: 'text',
      },
      {
        label: 'apartmentNumber_input.title',
        placeholder: 'apartmentNumber_input.placeholder',
        name: 'apartment_number',
        type: 'number',
      },
      {
        label: 'city_input.title',
        placeholder: 'city_input.placeholder',
        name: 'city',
        type: 'text',
      },
      {
        label: 'zipCode_input.title',
        placeholder: 'zipCode_input.placeholder',
        name: 'postal_code',
        type: 'number',
      },
      {
        label: 'ngo_reg_number_input.title',
        placeholder: 'ngo_reg_number_input.placeholder',
        name: 'reg_number',
        type: 'number',
      },
      {
        label: 'non_profit_status_input.title',
        placeholder: 'non_profit_status_input.placeholder',
        name: 'org_profit_status',
        type: 'select',
        options: ORGANIZATION_STATUSES,
        viewModel: ['id', 'status'],
      },
      {
        label: 'vat_number_input.title',
        placeholder: 'vat_number_input.placeholder',
        name: 'vat_number',
        type: 'number',
      },
    ],
    avatars: [
      `/assets/avatars/og1.svg`,
      `/assets/avatars/og2.svg`,
      `/assets/avatars/og3.svg`,
      `/assets/avatars/og4.svg`,
      `/assets/avatars/og5.svg`,
      `/assets/avatars/og7.svg`,
      `/assets/avatars/og8.svg`,
    ],
    hasReset: false,
  },
  landing: {
    uploadAvatarLabel: 'upload_avatar_ngo',
    selectedAvatarLabel: 'choose_avatar',
    role: 'landing',
    inputs: [
      {
        label: 'claim_input.title',
        placeholder: 'claim_input.placeholder',
        name: 'claim',
        type: 'text',
      },
      {
        label: 'about_short_input.title',
        placeholder: 'about_short_input.placeholder',
        name: 'about_short',
        type: 'text',
      },
      {
        label: 'blog_url_input.title',
        placeholder: 'blog_url_input.placeholder',
        name: 'blog_url',
        type: 'text',
      },
      {
        label: 'website_url_input.title',
        placeholder: 'website_url_input.placeholder',
        name: 'website_url',
        type: 'text',
      },
      {
        label: 'background_image_top_input.title',
        placeholder: 'background_image_top_input.placeholder',
        name: 'background_image_top',
        type: 'image',
        path: '',
      },
      {
        label: 'background_image_bottom_input.title',
        placeholder: 'background_image_bottom_input.placeholder',
        name: 'background_image_bottom',
        type: 'image',
        path: '',
      },
      {
        label: 'all_org_partners_in_current_organization_input.title',
        placeholder:
          'all_org_partners_in_current_organization_input.placeholder',
        name: 'all_org_partners_in_current_organization',
        type: 'array',
        array: [
          {
            label: 'image_input.title',
            placeholder: 'image_input.placeholder',
            name: 'image',
            type: 'image',
            path: '',
          },
          {
            label: 'name_input.title',
            placeholder: 'name_input.placeholder',
            name: 'name',
            type: 'text',
          },
          {
            label: 'description_input.title',
            placeholder: 'description_input.placeholder',
            name: 'description',
            type: 'text',
          },
        ],
      },
      {
        label: 'show_contact_form_input.title',
        name: 'show_contact_form',
        type: 'switch',
        description: 'show_contact_form_input.description',
      },
    ],
    avatars: [
      `/assets/avatars/og1.svg`,
      `/assets/avatars/og2.svg`,
      `/assets/avatars/og3.svg`,
      `/assets/avatars/og4.svg`,
      `/assets/avatars/og5.svg`,
      `/assets/avatars/og7.svg`,
      `/assets/avatars/og8.svg`,
    ],
    hasReset: false,
  },
};

export const ORGANIZATION_ADJUSTMENTS = [
  {
    label: '_input.title',
    placeholder: '_input.placeholder',
    name: 'data_entry',
    type: 'string',
  },
  {
    label: '_input.title',
    placeholder: '_input.placeholder',
    name: 'selection_field',
    type: 'select',
    options: [{ id: 1, name: 'Active' }],
  },
  {
    label: '_input.title',
    placeholder: '_input.placeholder',
    name: 'selection_field1',
    type: 'switch',
    description: 'describtion',
    checked: true,
  },
  {
    label: '_input.title',
    placeholder: '_input.placeholder',
    name: 'selection_field2',
    type: 'switch',
    description: 'describtion',
    checked: false,
  },
  {
    label: '_input.title',
    placeholder: '_input.placeholder',
    name: 'selection_field3',
    type: 'switch',
    description: 'describtion',
    checked: true,
  },
];

export const USER_PERMISSIONS = [
  {
    label: 'org_admin_input.title',
    placeholder: 'org_admin_input.placeholder',
    description: 'org_admin_input.description',
    name: 'org_admin',
    type: 'switch',
  },
  {
    label: 'consult_input.title',
    placeholder: 'consult_input.placeholder',
    description: 'consult_input.description',
    name: 'consult',
    type: 'switch',
  },
  {
    label: 'blog_input.title',
    placeholder: 'blog_input.placeholder',
    description: 'blog_input.description',
    name: 'blog',
    type: 'switch',
  },
];
