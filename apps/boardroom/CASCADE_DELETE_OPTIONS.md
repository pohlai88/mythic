# Cascade Delete Options & Analysis

## 📊 Current Cascade Delete Relationships

### **CASCADE Delete (Child records deleted when parent deleted)**

1. **Broadcasts → Broadcast Comments**
   - When broadcast deleted → all comments deleted
   - **Rationale**: Comments are part of the broadcast, no orphaned comments

2. **Broadcasts → Broadcast Reactions**
   - When broadcast deleted → all reactions deleted
   - **Rationale**: Reactions are part of the broadcast

3. **Broadcasts → Broadcast Versions**
   - When broadcast deleted → all version history deleted
   - **Rationale**: Version history is part of the broadcast

4. **Broadcasts → Broadcast Reads**
   - When broadcast deleted → all read tracking deleted
   - **Rationale**: Read tracking is part of the broadcast

5. **Circles → Circle Members**
   - When circle deleted → all members removed
   - **Rationale**: Members belong to the circle

6. **Proposals → Variance**
   - When proposal deleted → all variance records deleted
   - **Rationale**: Variance is specific to the proposal

7. **Case Whatif Budgets → Case Whatif Milestones**
   - When budget deleted → all milestones deleted
   - **Rationale**: Milestones are part of the budget

### **SET NULL (Child records preserved, reference set to null)**

1. **Proposals → Broadcasts**
   - When proposal deleted → broadcast.proposal_id set to null
   - **Rationale**: Broadcast can exist independently, just loses proposal link

## 🎯 Options for Implementation

### **Option 1: Keep Current Cascade (Recommended) ✅**

**Pros**:
- ✅ Data integrity maintained
- ✅ No orphaned records
- ✅ Clean database state
- ✅ Matches business logic (child records are part of parent)

**Cons**:
- ⚠️ Cannot recover child records if parent deleted
- ⚠️ Need to be careful with deletions

**Use Case**: Production-ready, data integrity critical

**Command**:
```bash
# Proceed with current schema
cd apps/boardroom
pnpm db:push
# Type "Yes" when prompted
```

---

### **Option 2: Change to SET NULL (Preserve Child Records)**

**Changes Needed**:
- Broadcast comments, reactions, versions, reads → `onDelete: 'set null'`
- Circle members → `onDelete: 'set null'`
- Variance → `onDelete: 'set null'`

**Pros**:
- ✅ Child records preserved
- ✅ Can recover data later
- ✅ Audit trail maintained

**Cons**:
- ⚠️ Orphaned records in database
- ⚠️ Need cleanup logic
- ⚠️ Queries need null checks

**Use Case**: Need to preserve audit trail, recovery important

**Implementation**:
```typescript
// Example change in broadcast-comments.ts
.references(() => broadcasts.id, { onDelete: 'set null' }) // Changed from 'cascade'
```

---

### **Option 3: Change to RESTRICT (Prevent Deletion)**

**Changes Needed**:
- All cascade relationships → `onDelete: 'restrict'`

**Pros**:
- ✅ Prevents accidental deletions
- ✅ Forces explicit cleanup
- ✅ Maximum data safety

**Cons**:
- ⚠️ Must delete children first
- ⚠️ More complex deletion logic
- ⚠️ Can block legitimate deletions

**Use Case**: Maximum safety, prevent accidental data loss

**Implementation**:
```typescript
// Example change
.references(() => broadcasts.id, { onDelete: 'restrict' })
```

---

### **Option 4: Hybrid Approach (Selective Cascade)**

**Strategy**:
- **CASCADE**: For truly dependent data (comments, reactions, versions)
- **SET NULL**: For optional relationships (broadcast → proposal)
- **RESTRICT**: For critical relationships (proposals → circles)

**Pros**:
- ✅ Balanced approach
- ✅ Preserves important data
- ✅ Cleans up dependent data

**Cons**:
- ⚠️ More complex to manage
- ⚠️ Need to decide per relationship

**Use Case**: Fine-grained control needed

---

## 🔍 Detailed Relationship Analysis

### **Broadcast Relationships**

| Child Table | Current | Recommended | Reason |
|------------|---------|-------------|--------|
| `broadcast_comments` | CASCADE | ✅ CASCADE | Comments are part of broadcast |
| `broadcast_reactions` | CASCADE | ✅ CASCADE | Reactions are part of broadcast |
| `broadcast_versions` | CASCADE | ⚠️ SET NULL | Version history might be needed for audit |
| `broadcast_reads` | CASCADE | ✅ CASCADE | Read tracking is part of broadcast |

### **Circle Relationships**

| Child Table | Current | Recommended | Reason |
|------------|---------|-------------|--------|
| `circle_members` | CASCADE | ⚠️ SET NULL | Members might need to be preserved |

### **Proposal Relationships**

| Child Table | Current | Recommended | Reason |
|------------|---------|-------------|--------|
| `variance` | CASCADE | ✅ CASCADE | Variance is specific to proposal |
| `case_whatif_budgets` | CASCADE | ✅ CASCADE | Budgets are part of proposal |
| `case_whatif_milestones` | CASCADE | ✅ CASCADE | Milestones are part of budget |

---

## 💡 Recommendations

### **For Production (Recommended)**
**Keep current CASCADE** for:
- Broadcast comments, reactions, reads
- Variance, budgets, milestones
- Circle members (if members are truly part of circle)

**Change to SET NULL** for:
- Broadcast versions (audit trail)
- Consider circle members (if users need to be preserved)

### **For Development/Testing**
**Keep CASCADE** - Easier cleanup, faster testing

---

## 🚀 Implementation Steps

### **Step 1: Review Current Schema**
```bash
# View schema files
ls apps/boardroom/src/db/schema/
```

### **Step 2: Choose Option**
- Option 1: Keep as-is (recommended)
- Option 2: Change to SET NULL
- Option 3: Change to RESTRICT
- Option 4: Hybrid approach

### **Step 3: Modify Schema (if needed)**
Edit schema files in `apps/boardroom/src/db/schema/`

### **Step 4: Push Schema**
```bash
cd apps/boardroom
pnpm db:push
```

---

## 📝 Quick Decision Guide

**Choose CASCADE if**:
- Child records are truly part of parent
- No need to preserve orphaned records
- Want clean database state

**Choose SET NULL if**:
- Need audit trail
- Child records have independent value
- Want to preserve data for recovery

**Choose RESTRICT if**:
- Maximum safety required
- Want to prevent accidental deletions
- Can handle complex deletion workflows

---

## ✅ Recommended: Option 1 (Keep Current)

**Reasoning**:
- Current cascade relationships make business sense
- Broadcast-related data should be deleted with broadcast
- Variance and budgets are proposal-specific
- Clean database state is important

**Action**:
```bash
cd apps/boardroom
pnpm db:push
# Type "Yes" when prompted
```

---

**Status**: Ready for Decision
**Last Updated**: 2026-01-11
