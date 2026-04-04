'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@bayou/supabase';
import type { Database } from '@bayou/supabase/types';
import { ContentCard } from './ContentCard';
import { PostFormModal } from './PostFormModal';

type Recipe = Database['public']['Tables']['recipes']['Row'] & {
  profiles: { display_name: string | null } | null;
};

interface RecipesPanelProps {
  userId: string;
  role: 'member' | 'guide' | 'admin';
}

const FIELDS = [
  {
    name: 'title',
    label: 'Recipe Title',
    type: 'text' as const,
    required: true,
    placeholder: 'e.g. Fried Speckled Trout',
  },
  {
    name: 'species',
    label: 'Fish Species',
    type: 'text' as const,
    placeholder: 'e.g. Speckled Trout',
  },
  {
    name: 'body',
    label: 'Recipe',
    type: 'textarea' as const,
    required: true,
    placeholder: 'Ingredients and instructions…',
  },
];

export function RecipesPanel({ userId, role }: RecipesPanelProps) {
  const supabase = useMemo(() => createClient(), []);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const loadRecipes = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('recipes')
      .select('*, profiles(display_name)')
      .eq('status', 'approved')
      .is('archived_at', null)
      .order('created_at', { ascending: false });
    setRecipes((data as Recipe[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadRecipes();
  }, [loadRecipes]);

  const handleCreate = async (values: Record<string, string>) => {
    await supabase.from('recipes').insert({
      title: values.title,
      species: values.species || null,
      body: values.body,
      status: 'approved',
      author_id: userId,
    });
    await loadRecipes();
  };

  const handleEdit = async (values: Record<string, string>) => {
    if (!editingRecipe) return;
    await supabase
      .from('recipes')
      .update({
        title: values.title,
        species: values.species || null,
        body: values.body,
      })
      .eq('id', editingRecipe.id);
    setEditingRecipe(null);
    await loadRecipes();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('recipes').delete().eq('id', id);
    await loadRecipes();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-text-dark dark:text-gold">
          🍳 Recipes
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-amber text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Share a Recipe
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <p className="text-sm text-text-mid dark:text-cream/60 font-serif">
          Loading recipes…
        </p>
      )}

      {/* Empty state */}
      {!loading && recipes.length === 0 && (
        <p className="text-sm text-text-mid dark:text-cream/60 font-serif">
          No recipes yet. Be the first to share one!
        </p>
      )}

      {/* Recipe cards */}
      {!loading && recipes.length > 0 && (
        <div className="flex flex-col gap-4">
          {recipes.map((recipe) => {
            const badges = [
              {
                label: 'Recipe',
                color: 'bg-amber/20 text-amber border border-amber/30',
              },
              ...(recipe.species
                ? [
                    {
                      label: recipe.species,
                      color:
                        'bg-green-water/20 text-green-water border border-green-water/30',
                    },
                  ]
                : []),
            ];

            const bodyText = recipe.body ?? '';
            const truncatedBody =
              bodyText.length > 300
                ? bodyText.slice(0, 300) + '…'
                : bodyText;

            return (
              <ContentCard
                key={recipe.id}
                title={recipe.title}
                badges={badges}
                meta={`Posted by ${recipe.profiles?.display_name ?? 'Member'} · ${new Date(recipe.created_at ?? '').toLocaleDateString()}`}
                body={truncatedBody}
                imageUrl={recipe.photo_url ?? undefined}
                isOwner={userId === recipe.author_id}
                isAdmin={role === 'admin'}
                onEdit={() => setEditingRecipe(recipe)}
                onDelete={() => void handleDelete(recipe.id)}
              />
            );
          })}
        </div>
      )}

      {/* Create modal */}
      <PostFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Share a Recipe"
        fields={FIELDS}
        onSubmit={handleCreate}
      />

      {/* Edit modal */}
      <PostFormModal
        isOpen={editingRecipe !== null}
        onClose={() => setEditingRecipe(null)}
        title="Edit Recipe"
        fields={FIELDS}
        initialValues={
          editingRecipe
            ? {
                title: editingRecipe.title,
                species: editingRecipe.species ?? '',
                body: editingRecipe.body ?? '',
              }
            : {}
        }
        onSubmit={handleEdit}
      />
    </div>
  );
}

export default RecipesPanel;
