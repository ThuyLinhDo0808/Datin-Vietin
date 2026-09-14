import { boolean, integer, jsonb, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', { id: text('id').primaryKey(), expiresAt: timestamp('expiresAt').notNull(), token: text('token').notNull().unique(), createdAt: timestamp('createdAt').notNull().defaultNow(), updatedAt: timestamp('updatedAt').notNull().defaultNow(), ipAddress: text('ipAddress'), userAgent: text('userAgent'), userId: text('userId').notNull() })
export const account = pgTable('account', { id: text('id').primaryKey(), accountId: text('accountId').notNull(), providerId: text('providerId').notNull(), userId: text('userId').notNull(), accessToken: text('accessToken'), refreshToken: text('refreshToken'), idToken: text('idToken'), accessTokenExpiresAt: timestamp('accessTokenExpiresAt'), refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'), scope: text('scope'), password: text('password'), createdAt: timestamp('createdAt').notNull().defaultNow(), updatedAt: timestamp('updatedAt').notNull().defaultNow() })
export const verification = pgTable('verification', { id: text('id').primaryKey(), identifier: text('identifier').notNull(), value: text('value').notNull(), expiresAt: timestamp('expiresAt').notNull(), createdAt: timestamp('createdAt').defaultNow(), updatedAt: timestamp('updatedAt').defaultNow() })

export const profiles = pgTable('dating_profile', { id: text('id').primaryKey(), userId: text('user_id').notNull().unique(), displayName: text('display_name').notNull(), age: integer('age').notNull(), bio: text('bio').notNull().default(''), city: text('city').notNull().default(''), role: text('role').notNull().default(''), avatarUrl: text('avatar_url').notNull().default(''), interests: jsonb('interests').$type<string[]>().notNull().default([]), seeking: text('seeking').notNull().default('relationship'), isVisible: boolean('is_visible').notNull().default(true), createdAt: timestamp('created_at').notNull().defaultNow(), updatedAt: timestamp('updated_at').notNull().defaultNow() })
export const preferences = pgTable('dating_preference', { id: text('id').primaryKey(), userId: text('user_id').notNull().unique(), minAge: integer('min_age').notNull().default(25), maxAge: integer('max_age').notNull().default(35), cities: jsonb('cities').$type<string[]>().notNull().default([]), interests: jsonb('interests').$type<string[]>().notNull().default([]), relationshipGoal: text('relationship_goal').notNull().default('relationship'), updatedAt: timestamp('updated_at').notNull().defaultNow() })
export const swipes = pgTable('dating_swipe', { id: text('id').primaryKey(), swiperUserId: text('swiper_user_id').notNull(), targetProfileId: text('target_profile_id').notNull(), direction: text('direction').notNull(), createdAt: timestamp('created_at').notNull().defaultNow() }, (table) => ({ uniqueSwipe: uniqueIndex('dating_swipe_unique').on(table.swiperUserId, table.targetProfileId) }))
export const matches = pgTable('dating_match', { id: text('id').primaryKey(), userAId: text('user_a_id').notNull(), userBId: text('user_b_id').notNull(), status: text('status').notNull().default('active'), createdAt: timestamp('created_at').notNull().defaultNow() })
export const messages = pgTable('dating_message', { id: text('id').primaryKey(), matchId: text('match_id').notNull(), senderUserId: text('sender_user_id').notNull(), body: text('body').notNull(), createdAt: timestamp('created_at').notNull().defaultNow(), readAt: timestamp('read_at') })
