import { Facet } from '../../types/models/facet.model';
import { Environment } from '../../types/environment';
import { getTenant } from 'helpers/tenant';

export async function getFacetsDefault(storefrontCode: Environment.StorefrontCode): Promise<Facet[] | undefined> {

  const runtimeConfig = useRuntimeConfig()
  const env =  runtimeConfig.public.environment
  const tenant = getTenant(storefrontCode, env)

  try {
    const preGeneratedFacets = await import (`../../data/defaults/facets.gen.json`) as unknown as Record<string, Facet[]>
    return preGeneratedFacets[tenant.id]
  } catch (error) {
      throw new Error('Cannot import file with pre-generated facets')
  }
}
