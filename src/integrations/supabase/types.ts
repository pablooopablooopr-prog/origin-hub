export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      _service_role_canary: {
        Row: {
          created_at: string
          id: number
          note: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          note?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          note?: string | null
        }
        Relationships: []
      }
      blocked_email_domains: {
        Row: {
          created_at: string
          domain: string
          reason: string | null
        }
        Insert: {
          created_at?: string
          domain: string
          reason?: string | null
        }
        Update: {
          created_at?: string
          domain?: string
          reason?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          company_id: string | null
          created_at: string
          customer_id: string
          id: string
          pack_id: string | null
          product_id: string | null
          quantity: number
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          customer_id: string
          id?: string
          pack_id?: string | null
          product_id?: string | null
          quantity?: number
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          pack_id?: string | null
          product_id?: string | null
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      checkout_requests: {
        Row: {
          amount_cents: number | null
          amount_total: number | null
          created_at: string
          currency: string | null
          error: string | null
          id: string
          kind: string
          paid_at: string | null
          payload: Json | null
          ref_id: string
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount_cents?: number | null
          amount_total?: number | null
          created_at?: string
          currency?: string | null
          error?: string | null
          id?: string
          kind: string
          paid_at?: string | null
          payload?: Json | null
          ref_id: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          amount_cents?: number | null
          amount_total?: number | null
          created_at?: string
          currency?: string | null
          error?: string | null
          id?: string
          kind?: string
          paid_at?: string | null
          payload?: Json | null
          ref_id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          authenticity_story: string | null
          avg_rating: number | null
          business_name: string
          business_type: string | null
          category_id: string | null
          contact_person: string
          cover_image_url: string | null
          created_at: string
          description: string | null
          email: string
          id: string
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          phone: string | null
          region_id: string | null
          slug: string | null
          social_media: Json | null
          status: string | null
          stripe_account_id: string | null
          stripe_charges_enabled: boolean | null
          stripe_connected_at: string | null
          stripe_details_submitted: boolean | null
          stripe_onboarded_at: string | null
          stripe_onboarding_status: string | null
          stripe_payouts_enabled: boolean | null
          total_reviews: number | null
          updated_at: string
          user_id: string | null
          website: string | null
          welcome_sent_at: string | null
        }
        Insert: {
          address?: string | null
          authenticity_story?: string | null
          avg_rating?: number | null
          business_name: string
          business_type?: string | null
          category_id?: string | null
          contact_person: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          email: string
          id?: string
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          phone?: string | null
          region_id?: string | null
          slug?: string | null
          social_media?: Json | null
          status?: string | null
          stripe_account_id?: string | null
          stripe_charges_enabled?: boolean | null
          stripe_connected_at?: string | null
          stripe_details_submitted?: boolean | null
          stripe_onboarded_at?: string | null
          stripe_onboarding_status?: string | null
          stripe_payouts_enabled?: boolean | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
          welcome_sent_at?: string | null
        }
        Update: {
          address?: string | null
          authenticity_story?: string | null
          avg_rating?: number | null
          business_name?: string
          business_type?: string | null
          category_id?: string | null
          contact_person?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          phone?: string | null
          region_id?: string | null
          slug?: string | null
          social_media?: Json | null
          status?: string | null
          stripe_account_id?: string | null
          stripe_charges_enabled?: boolean | null
          stripe_connected_at?: string | null
          stripe_details_submitted?: boolean | null
          stripe_onboarded_at?: string | null
          stripe_onboarding_status?: string | null
          stripe_payouts_enabled?: boolean | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
          welcome_sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      company_admin_audit: {
        Row: {
          action: string
          admin_user_id: string
          company_id: string
          created_at: string
          id: string
          reason: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          company_id: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          company_id?: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_admin_audit_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_admin_audit_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
        ]
      }
      company_packs: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          is_active: boolean
          is_demo: boolean | null
          is_published: boolean
          moderation_status: string
          name: string | null
          price: number | null
          published_at: string | null
          shipping_policy: string | null
          slug: string
          status: string | null
          sustainability_info: string | null
          tags: string[] | null
          template_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_demo?: boolean | null
          is_published?: boolean
          moderation_status?: string
          name?: string | null
          price?: number | null
          published_at?: string | null
          shipping_policy?: string | null
          slug: string
          status?: string | null
          sustainability_info?: string | null
          tags?: string[] | null
          template_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_demo?: boolean | null
          is_published?: boolean
          moderation_status?: string
          name?: string | null
          price?: number | null
          published_at?: string | null
          shipping_policy?: string | null
          slug?: string
          status?: string | null
          sustainability_info?: string | null
          tags?: string[] | null
          template_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_packs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_packs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_packs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "pack_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      company_referral_codes: {
        Row: {
          code: string
          company_id: string
          created_at: string
          id: string
        }
        Insert: {
          code: string
          company_id: string
          created_at?: string
          id?: string
        }
        Update: {
          code?: string
          company_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_referral_codes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_referral_codes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
        ]
      }
      company_referrals: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          referral_code: string
          referred_company_id: string | null
          referred_email: string | null
          referrer_company_id: string
          reward_applied_at: string | null
          reward_applied_by: string | null
          reward_status: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          referral_code: string
          referred_company_id?: string | null
          referred_email?: string | null
          referrer_company_id: string
          reward_applied_at?: string | null
          reward_applied_by?: string | null
          reward_status?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          referral_code?: string
          referred_company_id?: string | null
          referred_email?: string | null
          referrer_company_id?: string
          reward_applied_at?: string | null
          reward_applied_by?: string | null
          reward_status?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_referrals_referred_company_id_fkey"
            columns: ["referred_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_referrals_referred_company_id_fkey"
            columns: ["referred_company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_referrals_referrer_company_id_fkey"
            columns: ["referrer_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_referrals_referrer_company_id_fkey"
            columns: ["referrer_company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
        ]
      }
      company_reviews: {
        Row: {
          comment: string | null
          company_id: string
          created_at: string
          customer_id: string | null
          customer_name: string
          id: string
          is_approved: boolean | null
          is_verified_purchase: boolean | null
          rating: number
          title: string | null
        }
        Insert: {
          comment?: string | null
          company_id: string
          created_at?: string
          customer_id?: string | null
          customer_name: string
          id?: string
          is_approved?: boolean | null
          is_verified_purchase?: boolean | null
          rating: number
          title?: string | null
        }
        Update: {
          comment?: string | null
          company_id?: string
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          id?: string
          is_approved?: boolean | null
          is_verified_purchase?: boolean | null
          rating?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_reviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_reviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          is_resolved: boolean | null
          message: string
          name: string
          phone: string | null
          resolved_at: string | null
          resolved_by: string | null
          subject: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          message: string
          name: string
          phone?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          subject?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          message?: string
          name?: string
          phone?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          subject?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          notification_email: boolean | null
          notification_newsletter: boolean | null
          notification_offers: boolean | null
          notification_sms: boolean | null
          phone: string | null
          updated_at: string
          user_id: string
          welcome_sent_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          notification_email?: boolean | null
          notification_newsletter?: boolean | null
          notification_offers?: boolean | null
          notification_sms?: boolean | null
          phone?: string | null
          updated_at?: string
          user_id: string
          welcome_sent_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notification_email?: boolean | null
          notification_newsletter?: boolean | null
          notification_offers?: boolean | null
          notification_sms?: boolean | null
          phone?: string | null
          updated_at?: string
          user_id?: string
          welcome_sent_at?: string | null
        }
        Relationships: []
      }
      favorite_companies: {
        Row: {
          company_id: string
          created_at: string
          customer_id: string
          id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          customer_id: string
          id?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          customer_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorite_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorite_companies_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorite_companies_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          pack_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          pack_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          pack_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs_public"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean | null
          message: string | null
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          read_at?: string | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          pack_id: string | null
          product_id: string | null
          product_snapshot: Json | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          pack_id?: string | null
          product_id?: string | null
          product_snapshot?: Json | null
          quantity?: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          pack_id?: string | null
          product_id?: string | null
          product_snapshot?: Json | null
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          company_id: string | null
          created_at: string
          customer_id: string
          estimated_delivery: string | null
          id: string
          notes: string | null
          order_date: string
          pack_id: string | null
          payment_method: string | null
          payment_status: string | null
          shipping_address: string
          shipping_address_id: string | null
          status: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          total_amount: number
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          customer_id: string
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          order_date?: string
          pack_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address: string
          shipping_address_id?: string | null
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          customer_id?: string
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          order_date?: string
          pack_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: string
          shipping_address_id?: string | null
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "shipping_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      pack_analytics: {
        Row: {
          clicks: number | null
          date: string
          id: string
          pack_id: string | null
          views: number | null
        }
        Insert: {
          clicks?: number | null
          date?: string
          id?: string
          pack_id?: string | null
          views?: number | null
        }
        Update: {
          clicks?: number | null
          date?: string
          id?: string
          pack_id?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pack_analytics_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pack_analytics_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs_public"
            referencedColumns: ["id"]
          },
        ]
      }
      pack_elements: {
        Row: {
          content: Json
          created_at: string
          element_type: string
          id: string
          pack_id: string | null
          position: number
          styles: Json | null
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          element_type: string
          id?: string
          pack_id?: string | null
          position?: number
          styles?: Json | null
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          element_type?: string
          id?: string
          pack_id?: string | null
          position?: number
          styles?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pack_elements_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pack_elements_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs_public"
            referencedColumns: ["id"]
          },
        ]
      }
      pack_payments: {
        Row: {
          amount: number
          company_id: string
          created_at: string
          currency: string
          id: string
          order_id: string
          status: string
          stripe_account_id: string | null
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          company_id: string
          created_at?: string
          currency?: string
          id?: string
          order_id: string
          status?: string
          stripe_account_id?: string | null
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string
          currency?: string
          id?: string
          order_id?: string
          status?: string
          stripe_account_id?: string | null
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pack_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pack_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pack_payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      pack_products: {
        Row: {
          created_at: string
          id: string
          pack_id: string
          position: number | null
          product_id: string
          quantity: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          pack_id: string
          position?: number | null
          product_id: string
          quantity?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          pack_id?: string
          position?: number | null
          product_id?: string
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pack_products_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pack_products_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pack_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      pack_reviews: {
        Row: {
          comment: string | null
          created_at: string
          customer_id: string | null
          customer_name: string
          id: string
          pack_id: string | null
          rating: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name: string
          id?: string
          pack_id?: string | null
          rating: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          id?: string
          pack_id?: string | null
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "pack_reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pack_reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pack_reviews_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pack_reviews_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs_public"
            referencedColumns: ["id"]
          },
        ]
      }
      pack_templates: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          name: string
          requirements: Json | null
          type: string
        }
        Insert: {
          color: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          requirements?: Json | null
          type: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          requirements?: Json | null
          type?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          attributes: Json | null
          category_id: string | null
          company_id: string
          created_at: string
          description: string | null
          id: string
          images: Json | null
          is_available: boolean | null
          name: string
          origin: string | null
          price: number | null
          short_description: string | null
          slug: string
          stock_quantity: number | null
          updated_at: string
          weight: string | null
        }
        Insert: {
          attributes?: Json | null
          category_id?: string | null
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          is_available?: boolean | null
          name: string
          origin?: string | null
          price?: number | null
          short_description?: string | null
          slug: string
          stock_quantity?: number | null
          updated_at?: string
          weight?: string | null
        }
        Update: {
          attributes?: Json | null
          category_id?: string | null
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          is_available?: boolean | null
          name?: string
          origin?: string | null
          price?: number | null
          short_description?: string | null
          slug?: string
          stock_quantity?: number | null
          updated_at?: string
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          role: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          role?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
      promotional_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          current_uses: number | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_order_amount: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      regions: {
        Row: {
          coordinates: Json | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          slug: string
        }
        Insert: {
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          slug: string
        }
        Update: {
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      route_access: {
        Row: {
          created_at: string
          id: string
          route_id: string
          user_id: string
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          route_id: string
          user_id: string
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          route_id?: string
          user_id?: string
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "route_access_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_access_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes_public"
            referencedColumns: ["id"]
          },
        ]
      }
      route_company_packs: {
        Row: {
          company_pack_id: string
          created_at: string | null
          id: string
          route_id: string
        }
        Insert: {
          company_pack_id: string
          created_at?: string | null
          id?: string
          route_id: string
        }
        Update: {
          company_pack_id?: string
          created_at?: string | null
          id?: string
          route_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "route_company_packs_company_pack_id_fkey"
            columns: ["company_pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_company_packs_company_pack_id_fkey"
            columns: ["company_pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_company_packs_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_company_packs_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes_public"
            referencedColumns: ["id"]
          },
        ]
      }
      route_purchases: {
        Row: {
          base_price: number
          created_at: string
          customer_id: string
          discount_percent: number | null
          final_price: number
          id: string
          num_people: number
          payment_status: string
          purchased_at: string | null
          route_id: string
          stripe_payment_intent_id: string | null
        }
        Insert: {
          base_price: number
          created_at?: string
          customer_id: string
          discount_percent?: number | null
          final_price: number
          id?: string
          num_people?: number
          payment_status?: string
          purchased_at?: string | null
          route_id: string
          stripe_payment_intent_id?: string | null
        }
        Update: {
          base_price?: number
          created_at?: string
          customer_id?: string
          discount_percent?: number | null
          final_price?: number
          id?: string
          num_people?: number
          payment_status?: string
          purchased_at?: string | null
          route_id?: string
          stripe_payment_intent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "route_purchases_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_purchases_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_purchases_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_purchases_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes_public"
            referencedColumns: ["id"]
          },
        ]
      }
      route_stops: {
        Row: {
          address: string | null
          company_id: string | null
          created_at: string
          created_by: string
          description: string | null
          external_link: string | null
          highlights: Json | null
          id: string
          images: Json | null
          is_premium: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          position: number
          route_id: string
          schedule: string | null
          type: string | null
          type_icon: string | null
          what_to_do: Json | null
        }
        Insert: {
          address?: string | null
          company_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          external_link?: string | null
          highlights?: Json | null
          id?: string
          images?: Json | null
          is_premium?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          position?: number
          route_id: string
          schedule?: string | null
          type?: string | null
          type_icon?: string | null
          what_to_do?: Json | null
        }
        Update: {
          address?: string | null
          company_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          external_link?: string | null
          highlights?: Json | null
          id?: string
          images?: Json | null
          is_premium?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          position?: number
          route_id?: string
          schedule?: string | null
          type?: string | null
          type_icon?: string | null
          what_to_do?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "route_stops_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_stops_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_stops_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_stops_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes_public"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          avg_rating: number | null
          base_price_per_person: number | null
          created_at: string
          created_by: string
          creator_id: string | null
          daily_recommendations: Json | null
          description: string | null
          difficulty: string | null
          duration: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_demo: boolean | null
          is_featured: boolean | null
          is_public: boolean | null
          moderation_status: string
          narrative: string | null
          practical_info: Json | null
          region_id: string | null
          slug: string
          title: string
          total_participants: number | null
          total_stops: number | null
          updated_at: string
        }
        Insert: {
          avg_rating?: number | null
          base_price_per_person?: number | null
          created_at?: string
          created_by?: string
          creator_id?: string | null
          daily_recommendations?: Json | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_demo?: boolean | null
          is_featured?: boolean | null
          is_public?: boolean | null
          moderation_status?: string
          narrative?: string | null
          practical_info?: Json | null
          region_id?: string | null
          slug: string
          title: string
          total_participants?: number | null
          total_stops?: number | null
          updated_at?: string
        }
        Update: {
          avg_rating?: number | null
          base_price_per_person?: number | null
          created_at?: string
          created_by?: string
          creator_id?: string | null
          daily_recommendations?: Json | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_demo?: boolean | null
          is_featured?: boolean | null
          is_public?: boolean | null
          moderation_status?: string
          narrative?: string | null
          practical_info?: Json | null
          region_id?: string | null
          slug?: string
          title?: string
          total_participants?: number | null
          total_stops?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "routes_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_routes: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          notes: string | null
          route_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          notes?: string | null
          route_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          notes?: string | null
          route_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_routes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_routes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_routes_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_routes_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes_public"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_addresses: {
        Row: {
          city: string
          country: string | null
          created_at: string
          customer_id: string
          full_name: string
          id: string
          instructions: string | null
          is_default: boolean | null
          label: string | null
          phone: string | null
          postal_code: string
          province: string
          street_address: string
          updated_at: string
        }
        Insert: {
          city: string
          country?: string | null
          created_at?: string
          customer_id: string
          full_name: string
          id?: string
          instructions?: string | null
          is_default?: boolean | null
          label?: string | null
          phone?: string | null
          postal_code: string
          province: string
          street_address: string
          updated_at?: string
        }
        Update: {
          city?: string
          country?: string | null
          created_at?: string
          customer_id?: string
          full_name?: string
          id?: string
          instructions?: string | null
          is_default?: boolean | null
          label?: string | null
          phone?: string | null
          postal_code?: string
          province?: string
          street_address?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipping_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      stop_company_packs: {
        Row: {
          company_pack_id: string
          created_at: string
          stop_id: string
        }
        Insert: {
          company_pack_id: string
          created_at?: string
          stop_id: string
        }
        Update: {
          company_pack_id?: string
          created_at?: string
          stop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stop_company_packs_company_pack_id_fkey"
            columns: ["company_pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stop_company_packs_company_pack_id_fkey"
            columns: ["company_pack_id"]
            isOneToOne: false
            referencedRelation: "company_packs_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stop_company_packs_stop_id_fkey"
            columns: ["stop_id"]
            isOneToOne: false
            referencedRelation: "route_stops"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_context_log: {
        Row: {
          auth_uid: string | null
          created_at: string
          db_user: string | null
          id: number
          jwt_role: string | null
          jwt_sub: string | null
          source: string
        }
        Insert: {
          auth_uid?: string | null
          created_at?: string
          db_user?: string | null
          id?: number
          jwt_role?: string | null
          jwt_sub?: string | null
          source?: string
        }
        Update: {
          auth_uid?: string | null
          created_at?: string
          db_user?: string | null
          id?: number
          jwt_role?: string | null
          jwt_sub?: string | null
          source?: string
        }
        Relationships: []
      }
      webhook_whoami_log: {
        Row: {
          auth_uid: string | null
          created_at: string
          current_user_name: string
          id: number
          jwt_email: string | null
          jwt_role: string | null
          jwt_sub: string | null
          note: string | null
        }
        Insert: {
          auth_uid?: string | null
          created_at?: string
          current_user_name?: string
          id?: never
          jwt_email?: string | null
          jwt_role?: string | null
          jwt_sub?: string | null
          note?: string | null
        }
        Update: {
          auth_uid?: string | null
          created_at?: string
          current_user_name?: string
          id?: never
          jwt_email?: string | null
          jwt_role?: string | null
          jwt_sub?: string | null
          note?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      companies_public: {
        Row: {
          address: string | null
          authenticity_story: string | null
          avg_rating: number | null
          business_name: string | null
          business_type: string | null
          category_id: string | null
          cover_image_url: string | null
          description: string | null
          id: string | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          region_id: string | null
          slug: string | null
          social_media: Json | null
          total_reviews: number | null
          website: string | null
        }
        Insert: {
          address?: string | null
          authenticity_story?: string | null
          avg_rating?: number | null
          business_name?: string | null
          business_type?: string | null
          category_id?: string | null
          cover_image_url?: string | null
          description?: string | null
          id?: string | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          region_id?: string | null
          slug?: string | null
          social_media?: Json | null
          total_reviews?: number | null
          website?: string | null
        }
        Update: {
          address?: string | null
          authenticity_story?: string | null
          avg_rating?: number | null
          business_name?: string | null
          business_type?: string | null
          category_id?: string | null
          cover_image_url?: string | null
          description?: string | null
          id?: string | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          region_id?: string | null
          slug?: string | null
          social_media?: Json | null
          total_reviews?: number | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      company_admin_audit_view: {
        Row: {
          action: string | null
          admin_user_id: string | null
          business_name: string | null
          company_id: string | null
          created_at: string | null
          reason: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_admin_audit_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_admin_audit_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
        ]
      }
      company_packs_public: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string | null
          is_active: boolean | null
          is_published: boolean | null
          name: string | null
          price: number | null
          published_at: string | null
          shipping_policy: string | null
          slug: string | null
          status: string | null
          sustainability_info: string | null
          tags: string[] | null
          template_id: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string | null
          is_active?: boolean | null
          is_published?: boolean | null
          name?: string | null
          price?: number | null
          published_at?: string | null
          shipping_policy?: string | null
          slug?: string | null
          status?: string | null
          sustainability_info?: string | null
          tags?: string[] | null
          template_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string | null
          is_active?: boolean | null
          is_published?: boolean | null
          name?: string | null
          price?: number | null
          published_at?: string | null
          shipping_policy?: string | null
          slug?: string | null
          status?: string | null
          sustainability_info?: string | null
          tags?: string[] | null
          template_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_packs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_packs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_packs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "pack_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      customers_safe: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      routes_public: {
        Row: {
          avg_rating: number | null
          base_price_per_person: number | null
          created_at: string | null
          daily_recommendations: Json | null
          description: string | null
          difficulty: string | null
          duration: string | null
          id: string | null
          image_url: string | null
          is_featured: boolean | null
          narrative: string | null
          practical_info: Json | null
          region_id: string | null
          slug: string | null
          title: string | null
          total_participants: number | null
          total_stops: number | null
          updated_at: string | null
        }
        Insert: {
          avg_rating?: number | null
          base_price_per_person?: number | null
          created_at?: string | null
          daily_recommendations?: Json | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          id?: string | null
          image_url?: string | null
          is_featured?: boolean | null
          narrative?: string | null
          practical_info?: Json | null
          region_id?: string | null
          slug?: string | null
          title?: string | null
          total_participants?: number | null
          total_stops?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_rating?: number | null
          base_price_per_person?: number | null
          created_at?: string | null
          daily_recommendations?: Json | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          id?: string | null
          image_url?: string | null
          is_featured?: boolean | null
          narrative?: string | null
          practical_info?: Json | null
          region_id?: string | null
          slug?: string | null
          title?: string | null
          total_participants?: number | null
          total_stops?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "routes_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      am_i_email_verified: { Args: never; Returns: boolean }
      approve_company: { Args: { p_company_id: string }; Returns: undefined }
      current_user_owns_approved_company: {
        Args: { p_company_id: string }
        Returns: boolean
      }
      current_user_owns_company: {
        Args: { p_company_id: string }
        Returns: boolean
      }
      drop_all_policies: {
        Args: { p_schema: string; p_table: string }
        Returns: undefined
      }
      ensure_referral_code: { Args: { p_company_id: string }; Returns: string }
      extract_email_domain: { Args: { p_email: string }; Returns: string }
      get_company_admin_audit: {
        Args: never
        Returns: {
          action: string
          admin_user_id: string
          business_name: string
          company_id: string
          created_at: string
          reason: string
        }[]
      }
      get_my_company_status: { Args: never; Returns: string }
      grant_route_access_after_purchase: {
        Args: { p_route_id: string; p_user_id: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_pack_view: { Args: { p_pack_id: string }; Returns: number }
      increment_promo_code_safe: { Args: { code_id: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      is_company_approved: { Args: { p_company_id: string }; Returns: boolean }
      is_company_owner: { Args: { p_company_id: string }; Returns: boolean }
      is_pack_owner: { Args: { p_pack_id: string }; Returns: boolean }
      is_service_or_postgres: { Args: never; Returns: boolean }
      log_webhook_context: { Args: { p_source?: string }; Returns: undefined }
      log_webhook_whoami: { Args: never; Returns: undefined }
      mark_company_welcome_sent: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      mark_customer_welcome_sent: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      my_company_id: { Args: never; Returns: string }
      owns_route: { Args: { p_route_id: string }; Returns: boolean }
      owns_stop: { Args: { p_stop_id: string }; Returns: boolean }
      reject_company: {
        Args: { p_company_id: string; p_reason?: string }
        Returns: undefined
      }
      route_owner_id: {
        Args: { r: Database["public"]["Tables"]["routes"]["Row"] }
        Returns: string
      }
      set_company_stripe_account: {
        Args: { p_company_id: string; p_stripe_account_id: string }
        Returns: undefined
      }
      validate_promo_code: {
        Args: { code_value: string; order_total: number }
        Returns: {
          code_id: string
          discount_type: string
          discount_value: number
          error_message: string
          valid: boolean
        }[]
      }
      webhook_whoami: { Args: { note?: string }; Returns: Json }
      whoami_probe: { Args: never; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      company_status: "pending" | "approved" | "rejected" | "suspended"
      notification_type: "order" | "review" | "message" | "system" | "promotion"
      order_status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "refunded"
      pack_status: "draft" | "pending_review" | "published" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      company_status: ["pending", "approved", "rejected", "suspended"],
      notification_type: ["order", "review", "message", "system", "promotion"],
      order_status: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      pack_status: ["draft", "pending_review", "published", "archived"],
    },
  },
} as const
