-- Migracion 003: restringe la escritura a un solo usuario admin.
-- El proyecto de Supabase es compartido con otras apps (tiene otros usuarios
-- registrados); "authenticated" por si solo no basta, hay que fijar el UID.
-- Ejecutar completo en Supabase -> SQL Editor.

drop policy "admin write profile"    on profile;
drop policy "admin write education"  on education;
drop policy "admin write experience" on experience;
drop policy "admin write projects"   on projects;
drop policy "admin write skills"     on skills;

create policy "admin write profile"
  on profile for all
  using (auth.uid() = '703e42cd-4759-49ae-9f38-415b1727ed55')
  with check (auth.uid() = '703e42cd-4759-49ae-9f38-415b1727ed55');

create policy "admin write education"
  on education for all
  using (auth.uid() = '703e42cd-4759-49ae-9f38-415b1727ed55')
  with check (auth.uid() = '703e42cd-4759-49ae-9f38-415b1727ed55');

create policy "admin write experience"
  on experience for all
  using (auth.uid() = '703e42cd-4759-49ae-9f38-415b1727ed55')
  with check (auth.uid() = '703e42cd-4759-49ae-9f38-415b1727ed55');

create policy "admin write projects"
  on projects for all
  using (auth.uid() = '703e42cd-4759-49ae-9f38-415b1727ed55')
  with check (auth.uid() = '703e42cd-4759-49ae-9f38-415b1727ed55');

create policy "admin write skills"
  on skills for all
  using (auth.uid() = '703e42cd-4759-49ae-9f38-415b1727ed55')
  with check (auth.uid() = '703e42cd-4759-49ae-9f38-415b1727ed55');
