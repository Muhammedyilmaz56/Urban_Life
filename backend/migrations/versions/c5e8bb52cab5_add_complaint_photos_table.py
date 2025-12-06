"""add complaint_photos table

Revision ID: c5e8bb52cab5
Revises: 9eaf7a3f7c3b
Create Date: 2025-12-03 19:45:53.385496

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa



revision: str = 'c5e8bb52cab5'
down_revision: Union[str, Sequence[str], None] = '9eaf7a3f7c3b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'complaint_photos',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('complaint_id', sa.Integer, sa.ForeignKey('complaints.id', ondelete="CASCADE")),
        sa.Column('photo_url', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'))
    )


def downgrade():
    op.drop_table('complaint_photos')