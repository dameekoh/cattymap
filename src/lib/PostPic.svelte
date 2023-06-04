<script>
    import LedgerProfile from './LedgerProfile.svelte';
</script>




<div class="card fixed left-1 shadow-xl p-3 ml-7 space-y-2 bg-white items-left">
    <h2 class="card-title text-sm text-slate-500">Cats</h2>
    <LedgerProfile avatar = "https://cdn.iconscout.com/icon/premium/png-512-thumb/american-shorthair-1975261-1664591.png?f=avif&w=256" name = "Damir" checked={false} />
    <LedgerProfile avatar = "https://cdn.iconscout.com/icon/premium/png-512-thumb/abyssinnian-cat-1975262-1664592.png?f=avif&w=256" name = "Zhilin" checked = {false} />
    <LedgerProfile avatar = "https://cdn.iconscout.com/icon/premium/png-512-thumb/nebelung-1975276-1664606.png?f=avif&w=256" name = "Punn" checked = {false} />
  </div>